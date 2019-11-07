// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    hmr       : false,
    firebase: {
        apiKey: "AIzaSyDTRGqGvE41EyJBMj-9m_c56k3mN5LMBn4",
        authDomain: "gcalender-38b53.firebaseapp.com",
        databaseURL: "https://gcalender-38b53.firebaseio.com",
        projectId: "gcalender-38b53",
        storageBucket: "gcalender-38b53.appspot.com",
        messagingSenderId: "690729896946",
        appId: "1:690729896946:web:9ea2e937c034c42e52b96b",
        measurementId: "G-2CPQ0HSDRX"
      }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
