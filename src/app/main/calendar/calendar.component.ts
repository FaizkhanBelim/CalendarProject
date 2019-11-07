import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Subject, Subscription } from 'rxjs';
import { startOfDay, isSameDay, isSameMonth } from 'date-fns';
import {
    CalendarEventAction, CalendarEventTimesChangedEvent, CalendarMonthViewDay,
    CalendarEvent
} from 'angular-calendar';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { fuseAnimations } from '@fuse/animations';

import { CalendarService } from '../calendar/calendar.service';
import { CalendarEventModel, GoogleEventModel, Attendees } from '../calendar/event.model';
import { CalendarEventFormDialogComponent } from '../calendar/event-form/event-form.component';
import { AuthService } from './auth.service';


@Component({
    selector: 'calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class CalendarComponent implements OnInit, OnDestroy {
    actions: CalendarEventAction[];
    activeDayIsOpen: boolean;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    dialogRef: any;
    events: CalendarEvent[] = [];
    refresh: Subject<any> = new Subject();
    selectedDay: any;
    view: string;
    viewDate: Date;

    subscription: Subscription;

    googleExistingEvents: any = undefined;
    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.subscription.unsubscribe();
    }
    constructor(
        private _matDialog: MatDialog,
        public auth: AuthService,
        public _calendarService: CalendarService,
    ) {

        // Set the defaults
        this.view = 'month';
        this.viewDate = new Date();
        this.activeDayIsOpen = true;
        this.selectedDay = { date: startOfDay(new Date()) };

        this.actions = [
            {
                label: '<i class="material-icons s-16">edit</i>',
                onClick: ({ event }: { event: CalendarEvent }): void => {
                    this.editEvent('edit', event);
                }
            },
            {
                label: '<i class="material-icons s-16">delete</i>',
                onClick: ({ event }: { event: CalendarEvent }): void => {
                    this.deleteEvent(event);
                }
            }
        ];



        this.subscription = this._calendarService.getMessage().subscribe(message => {

            if (!!message && message.text) {
                this.googleExistingEvents = message.text.result;

                if (!!this.googleExistingEvents && !!this.googleExistingEvents.items &&
                    this.googleExistingEvents.items.length >= 1) {
                    this.events = [];
                    this.googleExistingEvents.items.forEach(eventData => {
                        let eventToPush: CalendarEvent = {
                            start: new Date(eventData.start.dateTime),
                            title: eventData.summary,
                            end: !!eventData.end ? new Date(eventData.end.dateTime) : new Date(eventData.start.dateTime),
                            id: eventData.id
                        };
                        this.events.push(eventToPush);
                        this.refresh.next(true);
                    });
                }
            }
        });


        /**
         * Get events from service/server
         */
        this.setEvents();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        /**
         * Watch re-render-refresh for updating db
         */
        // this.refresh.subscribe(updateDB => {
        //     if ( updateDB )
        //     {
        //         this._calendarService.updateEvents(this.events);
        //     }
        // });

        // this._calendarService.onEventsUpdated.subscribe(events => {
        //     this.setEvents();
        //     this.refresh.next();
        // });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Set events
     */
    setEvents(): void {
        // this.events = this._calendarService.events.map(item => {
        //     item.actions = this.actions;
        //     return new CalendarEventModel(item);
        // });
    }


    /**
     * Before View Renderer
     *
     * @param {any} header
     * @param {any} body
     */
    beforeMonthViewRender({ header, body }): void {
        /**
         * Get the selected day
         */
        const _selectedDay = body.find((_day) => {
            return _day.date.getTime() === this.selectedDay.date.getTime();
        });

        if (_selectedDay) {
            /**
             * Set selected day style
             * @type {string}
             */
            _selectedDay.cssClass = 'cal-selected';
        }

    }

    /**
     * Day clicked
     *
     * @param {MonthViewDay} day
     */
    dayClicked(day: CalendarMonthViewDay): void {
        const date: Date = day.date;
        const events: CalendarEvent[] = day.events;

        if (isSameMonth(date, this.viewDate)) {
            if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
                this.activeDayIsOpen = false;
            }
            else {
                this.activeDayIsOpen = true;
                this.viewDate = date;
            }
        }
        this.selectedDay = day;
        this.refresh.next();
    }

    /**
     * Event times changed
     * Event dropped or resized
     *
     * @param {CalendarEvent} event
     * @param {Date} newStart
     * @param {Date} newEnd
     */
    eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
        event.start = newStart;
        event.end = newEnd;
        // console.warn('Dropped or resized', event);
        this.refresh.next(true);
    }

    /**
     * Delete Event
     *
     * @param event
     */
    deleteEvent(event): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete event?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                const eventIndex = this.events.indexOf(event);
                this.events.splice(eventIndex, 1);
                this.refresh.next(true);
                this._calendarService.deleteEvent(event.id);
            }
            this.confirmDialogRef = null;
        });

    }

    /**
     * Edit Event
     *
     * @param {string} action
     * @param {CalendarEvent} event
     */
    editEvent(action: string, event: CalendarEvent): void {
        const eventIndex = this.events.indexOf(event);

        this.dialogRef = this._matDialog.open(CalendarEventFormDialogComponent, {
            panelClass: 'event-form-dialog',
            data: {
                event: event,
                action: action
            }
        });

        this.dialogRef.afterClosed()
            .subscribe(response => {
                if (!response) {
                    return;
                }
                const actionType: string = response[0];
                const formData: FormGroup = response[1];
                switch (actionType) {
                    /**
                     * Save
                     */
                    case 'save':
                        this.events[eventIndex] = Object.assign(this.events[eventIndex], formData.getRawValue());
                        const updatedEvent = formData.getRawValue();
                        this.refresh.next(true);
                        let updatedEventId = response[3]
                        let dataToPush = new GoogleEventModel();
                        dataToPush.description = updatedEvent.title;
                        dataToPush.summary = updatedEvent.title;
                        dataToPush.start = new Date(updatedEvent.start);
                        dataToPush.end = !!new Date(updatedEvent.end) ? new Date(updatedEvent.end) : new Date(updatedEvent.start);
                        dataToPush.startTime = updatedEvent.startTime.slice(0, updatedEvent.startTime.indexOf(":"));
                        dataToPush.endTime = updatedEvent.endTime.slice(0, updatedEvent.endTime.indexOf(":"));                        
                        dataToPush.attendees = [];
                        if (!!response[2] && response[2].length >= 1) {
                            response[2].forEach(emai => {
                                let att = new Attendees();
                                att.email = emai;
                                dataToPush.attendees.push(att);
                            });
                        }
                        this._calendarService.updateEvent(dataToPush, updatedEventId);
                        break;
                    /**
                     * Delete
                     */
                    case 'delete':

                        this.deleteEvent(event);

                        break;
                }
            });
    }

    /**
     * Add Event
     */
    addEvent(): void {
        this.dialogRef = this._matDialog.open(CalendarEventFormDialogComponent, {
            panelClass: 'event-form-dialog',
            data: {
                action: 'new',
                date: this.selectedDay.date
            }
        });
        this.dialogRef.afterClosed()
            .subscribe((response: FormGroup | any) => {
                if (!response) {
                    return;
                }
                const newEvent = response[0].getRawValue();
                newEvent.actions = this.actions;

                let dataToPush = new GoogleEventModel();
                dataToPush.description = newEvent.title;
                dataToPush.summary = newEvent.title;
                dataToPush.start = new Date(newEvent.start);
                dataToPush.end = !!new Date(newEvent.end) ? new Date(newEvent.end) : new Date(newEvent.start);
                dataToPush.startTime = newEvent.startTime.slice(0, newEvent.startTime.indexOf(":"));
                dataToPush.endTime = newEvent.endTime.slice(0, newEvent.endTime.indexOf(":"));
                dataToPush.attendees = [];
                if (!!response[1] && response[1].length >= 1) {
                    response[1].forEach(emai => {
                        let att = new Attendees();
                        att.email = emai;
                        dataToPush.attendees.push(att);
                    });
                }
                this._calendarService.insertEvent(dataToPush);
                // this.refresh.next(true);
            });
    }
}


