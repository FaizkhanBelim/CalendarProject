import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CalendarEvent } from 'angular-calendar';

import { MatColors } from '@fuse/mat-colors';

import { CalendarEventModel } from '../event.model';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';


@Component({
    selector: 'calendar-event-form-dialog',
    templateUrl: './event-form.component.html',
    styleUrls: ['./event-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class CalendarEventFormDialogComponent {
    action: string;
    event: CalendarEvent;
    eventForm: FormGroup;
    dialogTitle: string;
    updatedEventId:any;
    presetColors = MatColors.presets;


    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    fruits: any[] = [
    ];

    add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        // Add our fruit
        if ((value || '').trim()) {
            this.fruits.push(value.trim());
        }

        // Reset the input value
        if (input) {
            input.value = '';
        }
    }

    remove(fruit: any): void {
        const index = this.fruits.indexOf(fruit);

        if (index >= 0) {
            this.fruits.splice(index, 1);
        }
    }


    /**
     * Constructor
     *
     * @param {MatDialogRef<CalendarEventFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<CalendarEventFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder
    ) {
        this.event = _data.event;
        this.action = _data.action;

        if (this.action === 'edit') {
            this.dialogTitle = this.event.title;
            this.updatedEventId = this.event.id;
        }
        else {
            this.dialogTitle = 'New Event';
            this.event = new CalendarEventModel({
                start: _data.date,
                end: _data.date
            });
        }

        this.eventForm = this.createEventForm();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create the event form
     *
     * @returns {FormGroup}
     */
    createEventForm(): FormGroup {
        return new FormGroup({
            title: new FormControl(this.event.title, [Validators.required]),
            start: new FormControl(this.event.start, [Validators.required]),
            end: new FormControl(this.event.end, [Validators.required]),
            //allDay: new FormControl(this.event.allDay, [Validators.required]),
            startTime: new FormControl("", [Validators.required]),
            endTime: new FormControl("", [Validators.required])
            // color : this._formBuilder.group({
            //     primary  : new FormControl(this.event.color.primary),
            //     secondary: new FormControl(this.event.color.secondary)
            // }),
            // meta  :
            //     this._formBuilder.group({
            //         location: new FormControl(this.event.meta.location),
            //         notes   : new FormControl(this.event.meta.notes)
            //     })
        });
    }
}
