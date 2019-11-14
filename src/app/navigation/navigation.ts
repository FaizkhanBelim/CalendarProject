import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id       : 'applications',
        title    : 'Applications',
        translate: 'NAV.APPLICATIONS',
        type     : 'group',
        children : [
            {
                id       : 'sample',
                title    : 'Message',
                translate: 'You',
                type     : 'item',
                icon     : 'email',
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
                icon     : 'email',
                url      : '/sample',
            },
            {
                id       : 'sample',
                title    : 'Message',
                translate: 'Newsfeed',
                type     : 'item',
                icon     : 'email',
                url      : '/sample',
            }
        ]
    }
];
