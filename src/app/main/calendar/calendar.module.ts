import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
    MatButtonModule, MatDatepickerModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSlideToggleModule, MatToolbarModule, MatTooltipModule
} from '@angular/material';
import { ColorPickerModule } from 'ngx-color-picker';
import { CalendarModule as AngularCalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule } from '@fuse/components';

import { CalendarComponent } from '../calendar/calendar.component';
import { CalendarService } from '../calendar/calendar.service';
import { CalendarEventFormDialogComponent } from '../calendar/event-form/event-form.component';
import { MatChipsModule } from '@angular/material/chips';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const routes: Routes = [
    {
        path: '**',
        component: CalendarComponent,
        children: [],
        resolve: {
            chat: CalendarService
        }
    }
];

@NgModule({
    declarations: [
        CalendarComponent,
        CalendarEventFormDialogComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        BrowserAnimationsModule,
        MatButtonModule,
        MatDatepickerModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSlideToggleModule,
        MatToolbarModule,
        MatTooltipModule,
        MatChipsModule,
        AngularCalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory
        }),
        ColorPickerModule,

        FuseSharedModule,
        FuseConfirmDialogModule,

    ],
    providers: [
        CalendarService
    ],
    entryComponents: [
        CalendarEventFormDialogComponent
    ]
})
export class CalendarModule {
}
