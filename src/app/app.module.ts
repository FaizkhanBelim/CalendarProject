import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule, MatIconModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { SampleModule } from 'app/main/sample/sample.module';
import { CalendarModule } from './main/calendar/calendar.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule, AngularFireAuth } from '@angular/fire/auth';
import {environment } from '../environments/environment';

const appRoutes: Routes = [
    // {
    //     path: '**',
    //     redirectTo: 'sample'
    // },
    // {
    //     path: '**',
    //     loadChildren: './main/login-2/login-2.module#Login2Module'
    // }
    {
        path: '**',
        loadChildren: './main/calendar/calendar.module#CalendarModule'
    },
    // {
    //     path: '**',
    //     loadChildren: './main/calendar/calendar.module#CalendarModule'
    // }
];

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),

        TranslateModule.forRoot(),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,

        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LayoutModule,
        SampleModule,
        CalendarModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,

        // ToastrModule.forRoot() // ToastrModule added

    ],
    providers:[AngularFireAuth],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}
