import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { AuthService } from './auth.service';
import { GoogleEventModel } from './event.model';

declare var gapi: any;


@Injectable()
export class CalendarService implements Resolve<any>
{
    events: any;
    onEventsUpdated: Subject<any>;
    user$: Observable<firebase.User>;
    calendarItems: any[];

    private subject = new Subject<any>();
    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
        public afAuth: AngularFireAuth,
        public _authServices: AuthService
    ) {
        this.initClient();
        this.user$ = afAuth.authState;
        // Set the defaults
        this.onEventsUpdated = new Subject();




    }
    initClient() {
        gapi.load('client', () => {
            console.log('loaded client')

            // It's OK to expose these credentials, they are client safe.
            gapi.client.init({
                apiKey: 'AIzaSyDdV_eWna4SXL2gs13uir6sockxcaSHhdY',
                clientId: '522120810211-q7rkdkms29v6vu3q8f36f465btqlv3ji.apps.googleusercontent.com',
                discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/people/v1/rest'],
                scope: 'https://www.googleapis.com/auth/calendar'
            }).then(function () {
                // do stuff with loaded APIs
                console.log('it worked');
            });

            gapi.client.load('calendar', 'v3', () => console.log('loaded calendar'));

        });
    }

    async login() {
        const googleAuth = gapi.auth2.getAuthInstance()
        const googleUser = await googleAuth.signIn();

        const token = googleUser.getAuthResponse().id_token;

        console.log(googleUser)

        const credential = auth.GoogleAuthProvider.credential(token);

        await this.afAuth.auth.signInAndRetrieveDataWithCredential(credential);

        this.events = await this.getCalendar();

        this.subject.next({ text: this.events });
        // Alternative approach, use the Firebase login with scopes and make RESTful API calls
        // const provider = new auth.GoogleAuthProvider()
        // provider.addScope('https://www.googleapis.com/auth/calendar');
        // this.afAuth.auth.signInWithPopup(provider)

    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {
            Promise.all([
                // this.getEvents()
            ]).then(
                ([events]: [any]) => {
                    resolve();
                },
                reject
            );
        });
    }

    async getCalendar() {
        const events = await gapi.client.calendar.events.list({
            calendarId: 'primary',
            timeMin: new Date().toISOString(),
            showDeleted: false,
            singleEvents: true,
            maxResults: 10,
            orderBy: 'startTime'
        })

        // console.log("events",events)


        // this.calendarItems = events.result.items;
        // this.events= events.result.items;

        return events;
    }


    async insertEvent(insertEvent: GoogleEventModel) {
        const hoursFromNow = (n, date) => new Date(new Date(date).getTime() + n * 1000 * 60 * 60).toISOString();
        const insert = await gapi.client.calendar.events.insert({
            calendarId: 'primary',
            start: {
                dateTime: hoursFromNow(insertEvent.startTime, insertEvent.start),

            },
            end: {
                dateTime: hoursFromNow(insertEvent.endTime, insertEvent.end),

            },
            summary: insertEvent.summary,
            description: insertEvent.description,
            attendees: insertEvent.attendees
        })
        this.events = await this.getCalendar();
        this.subject.next({ text: this.events });


    }
    async deleteEvent(eventId) {
        const events = await gapi.client.calendar.events.delete({
            calendarId: 'primary',
            eventId: eventId,
        });
        console.log(events);
        this.events = await this.getCalendar();
        this.subject.next({ text: this.events });
    }
    async updateEvent(updatedEvent,id) {
        console.log("event",updatedEvent);
        
        //Get call for event
        // const events = await gapi.client.calendar.events.get({
        //     calendarId: 'primary',
        //     eventId: id,
        // });
        //Updating Summary
        // events.result.summary = updatedEvent.summary;
        const hoursFromNow = (n, date) => new Date(new Date(date).getTime() + n * 1000 * 60 * 60).toISOString();
        const updatEvent = await gapi.client.calendar.events.update({
            calendarId: 'primary',
            eventId: id,
            summary: updatedEvent.summary,
            description: updatedEvent.description,
            attendees: updatedEvent.attendees,
            start: {
                dateTime: hoursFromNow(updatedEvent.startTime, updatedEvent.start),

            },
            end: {
                dateTime: hoursFromNow(updatedEvent.endTime, updatedEvent.end),

            }        
        });
        this.events = await this.getCalendar();
        this.subject.next({ text: this.events });
    }


    /**
     * Get events
     *
     * @returns {Promise<any>}
     */
    getEvents(): Promise<any> {
        return new Promise((resolve, reject) => {

            this.events = this._authServices.getCalendar();

            // this._httpClient.get('api/calendar/events')
            //     .subscribe((response: any) => {
            //         this.events = response.data;
            //         this.onEventsUpdated.next(this.events);
            //         resolve(this.events);
            //     }, reject);
        });
    }

    /**
     * Update events
     *
     * @param events
     * @returns {Promise<any>}
     */
    updateEvents(events): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.post('api/calendar/events', {
                id: 'events',
                data: [...events]
            })
                .subscribe((response: any) => {
                    this.getEvents();
                }, reject);
        });
    }

}
