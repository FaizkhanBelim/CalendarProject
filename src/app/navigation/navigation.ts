import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id       : 'applications',
        title    : '',
        translate: 'NAV.APPLICATIONS',
        type     : 'group',
        children : [
            {
                id       : 'sample',
                title    : 'Message',
                translate: 'You',
                type     : 'item',
                icon     : 'supervised_user_circle',
                url      : '/sample',
            },
            {
                id       : 'sample',
                title    : 'Message',
                translate: 'Message',
                type     : 'item',
                icon     : 'email',
                url      : '/sample',
            },
            {
                id       : 'sample',
                title    : 'Message',
                translate: 'Colaboration',
                type     : 'item',
                icon     : 'insert_link',
                url      : '/sample',
            },
            {
                id       : 'sample',
                title    : 'Message',
                translate: 'Newsfeed',
                type     : 'item',
                icon     : 'surround_sound',
                url      : '/sample',
            }
        ]
    }
];
