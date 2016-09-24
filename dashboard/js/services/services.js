/**
 * Created by dmytroshchurov on 22/09/16.
 */
(function (angular) {
    'use strict';

    function DashboardService() {
        var callbacks = {};
        var iconId = 1;

        function isArray(obj){
            return toString.call(obj) === '[object Array]';
        }

        function fire(event, icon, placeholder) {
            var subscribers = callbacks[event];

            if (!subscribers || !subscribers.length)
                return;

            angular.forEach(subscribers, function (callback) {
                callback(icon, placeholder);
            });
        }

        var dashboard = {
            iconCaptured: function (icon) {
                fire('capture', icon);
            },
            iconReleased: function (icon) {
                fire('release', icon);
            },
            placeholderAccepting: function (icon, placeholder) {
                fire('accept', icon, placeholder);
            },
            on: function (event, callback) {
                if (!event || !callback)
                    return;

                var subscribers = callbacks[event];
                if (!isArray(subscribers))
                    callbacks[event] = [];

                callbacks[event].push(callback);
            },
            off: function (event, callback) {
                if (!event || !callback)
                    return;

                var subscribers = callbacks[event];
                if (!isArray(subscribers))
                    return;
            },
            registerIcon: function () {
                return {id: iconId++};
            }
        };

        return dashboard;
    }

    function UnderscoreFactory($window) {
        return $window._;
    }

    function MessageFactory($rootScope, underscore) {
        var message = {
            publish: function () {
                var name = arguments[0];
                if (!angular.isDefined(name) || name === '') {
                    return null;
                }

                //var splice = [].splice;
                var push = [].push;

                push.apply(arguments, [new Date()]);

                return $rootScope.$broadcast.apply($rootScope, arguments);
            },

            subscribe: function (events, listener, scope) {
                if (!angular.isArray(events)) {
                    events = [events];
                }

                underscore.each(events, function (name) {
                    var fnUnsubscribe = $rootScope.$on(name, listener);

                    if (angular.isDefined(scope)) {
                        scope.$on('$destroy', function () {
                            fnUnsubscribe();
                        });
                    }
                });
            }
        };

        return message;
    }

    function Settings(localStorage, storageName, settingsDefault) {
        var saved = angular.fromJson(localStorage.get(storageName));
        var value = saved ? saved : settingsDefault;

        var persist = function () {
            localStorage.set(storageName, angular.toJson(value));
        };

        this.get = function (key) {
            return value[key];
        };

        this.set = function (key, val) {
            value[key] = angular.isObject(val) ? angular.extend({}, val) : val;
            persist();
        };

        this.remove = function (key) {
            delete value[key];
            persist();
        };

        this.restoreDefaults = function () {
            value = settingsDefault;
            localStorage.set(storageName, undefined);
        };
    }

    function Application(localStorage, $state, config, envConfig, settingsDefault) {
        var STORAGE_NAME = 'exa_settings';

        this.config = config;
        this.environmentConfig = envConfig;

        this.settings = new Settings(localStorage, STORAGE_NAME, settingsDefault);

        this.status = {};

        this.user = {};


        this.version = config.app.version;
        this.name = config.app.name;

        this.reset = function () {
            this.status.returnTo = undefined;
            this.serverVersion = undefined;
            this.status.systemInfoRequested = undefined;
        };

        this.relaunch = function (returnTo, withParams) {
            if (!returnTo) {
                if (this.status.returnTo && this.status.returnTo.state) {
                    returnTo = this.status.returnTo.state;
                } else {
                    returnTo = config.defaultState;
                }
            }

            if (!withParams) {
                if (this.status.returnTo && this.status.returnTo.params) {
                    withParams = this.status.returnTo.params;
                }
            }

            this.reset();

            $state.go(returnTo, withParams);
        };

        /**
         * Taken from archived version of deleted github repo 'compare-version'. http://r.cnpmjs.org/compare-version/download/compare-version-0.1.2.tgz
         * @param a
         * @param b
         * @returns {*}
         */
        this.compareVersion = function (a, b) {
            var i;
            var len;

            if (typeof a + typeof b !== 'stringstring') {
                return false;
            }

            a = a.split('.');
            b = b.split('.');
            i = 0;
            len = Math.max(a.length, b.length);

            for (; i < len; i++) {
                if ((a[i] && !b[i] && parseInt(a[i]) > 0) || (parseInt(a[i]) > parseInt(b[i]))) {
                    return 1;
                } else if ((b[i] && !a[i] && parseInt(b[i]) > 0) || (parseInt(a[i]) < parseInt(b[i]))) {
                    return -1;
                }
            }

            return 0;
        };
    }


    function ApplicationProvider() {
        // use a nature of a provider to configure the application service
        this.$get = ['localStorageService', '$state', 'config', 'environmentConfig', 'settingsDefault',
            function ApplicationFactory(localStorage, $state, config, envConfig, settingsDefault) {

                var application = function () {
                    return new Application(localStorage, $state, config, envConfig, settingsDefault);
                };

                return application;
            }];
    }

    function NetworkActivityFactory($timeout, config) {
        var CLASS_BUSY = 'busy';

        var busyIndicatorSemaphore = 0;
        var body = $('body');

        var threshold = null;

        var cancelThreshold = function () {
            if (threshold !== null) {
                $timeout.cancel(threshold);
                threshold = null;
            }
        };

        return {
            start: function () {
                ++busyIndicatorSemaphore;

                cancelThreshold();

                threshold = $timeout(function () {
                    if (!body.hasClass(CLASS_BUSY)) {
                        body.addClass(CLASS_BUSY);
                    }
                }, config.network.activityThreshold);

            },
            end: function () {
                if (--busyIndicatorSemaphore <= 0) {
                    cancelThreshold();

                    busyIndicatorSemaphore = 0; // make it ready for a next start
                    body.removeClass(CLASS_BUSY);
                }
            }
        };
    }

    angular.module('dashboard.services', ['toaster', 'LocalStorageModule', 'dashboard.configuration'])
        .factory('underscore', ['$window', UnderscoreFactory])
        .factory('message', ['$rootScope', 'underscore', MessageFactory])
        .factory('networkActivity', ['$timeout', 'config', NetworkActivityFactory])
        .factory('dashboard', [DashboardService])
        .provider('application', [ApplicationProvider]);
})(window.angular);