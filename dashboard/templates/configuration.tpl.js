/**
 * Created by dmytroshchurov on 22/09/16.
 */
(function (angular) {
    'use strict';

    // the module is defined in _Layout.cshtml
    angular.module('dashboard.configuration', [])
        .constant('config', {
            app: {
                name: '<%= appName %>',
                version: '<%= appVersion %>'
            },
            messages: {
                userAuthenticated: 'app:on-user-authenticated',
                userSignedOut: 'app:on-user-signed-out',
                userProfileUpdated: 'app:on-user-profile-updated',
                httpRequestStart: 'app:on-http-request-start',
                httpRequestEnd: 'app:on-http-request-end',
                scrollComplete: 'app:on-scroll-complete',
                sessionInitialized: 'app:on-session-initialized',
                sessionTerminated: 'app:on-session-terminated',
                asyncFormValidationFailed: 'app:on-async-form-validation-failed',
                networkIsAvailable: 'app:network-is-available',
                networkIsNotAvailable: 'app:network-is-not-available',
                stateChanged: 'app:on-state-changed',
                stateChanging: 'app:on-state-changing'
            },
            network: {
                timeout: 30000,
                activityThreshold: 1000
            },
            states: {
                default: 'home.main',
                dashboard: 'home.dashboard',
                profile: 'home.profile',
                support: 'home.support',
                guides: 'home.guides',
                signin: 'home.signin'
            },
            urls: {
                views: {
                    dashboard: 'views/dashboard.html',
                    support: 'views/support.html',
                    signin: 'views/signin.html',
                    profile: 'views/profile.html',
                    guides: 'views/guides.html',
                    main: 'views/main.html',
                    header: 'views/_header.html',
                    footer: 'views/_footer.html',
                    authenticationBar: 'views/_authenticationBar.html',
                    empty: 'views/_empty.html'
                },
                pages: {
                    dashboard: '/dashboard/',
                    guides: '/guides',
                    support: '/support/',
                    signin: '/signin/',
                    signout: '/signout',
                    profile: '/profile/',
                    main: '/main',
                    home: '/home',
                },
                templates: {}
            },
            actions: {
                login: {
                    signin: 'signin',
                    signout: 'signout'
                }
            },
            notification: {
                timeToDisplay: 5000,
                type: {
                    error: 'error',
                    info: 'info',
                    warning: 'warning',
                    success: 'success',
                    wait: 'wait'
                },
                format: {
                    text: 'text',
                    html: 'trustedHtml',
                    template: 'templateWithData'
                }
            }
        })
        .value('settingsDefault', {
            // default application settings; used when a local storage does not contain application settings yet
        })
        .constant('environmentConfig', {
            urls: {
                api: {
                    // substituted with gulp 'build-environment-configuration' task depending on input parameter
                    base: '<%= apiBaseUrl %>',
                    dashboard: {
                        getDashboard: 'dashboard'
                    },
                    auth: {
                        login: 'token',
                        logout: 'account/logout'
                    },
                    profile: 'account/profile'
                }
            },
            emails: {
                contact: '<%= exponeaContactEmail %>'
            },
            thirdPartyApi: {
                secretApiPublicKey: '<%= secretApiPublicKey %>'
            },
        });
})(window.angular);