/**
 * Created by dmytroshchurov on 22/09/16.
 */
(function (angular) {
    'use strict';

    function ConfigureRoutes($stateProvider, $urlRouterProvider, config, resolvers) {

        // Warning. A simple form as of .otherwise('location') causes an infinite redirection loop,
        // when your resolvers raise a compile time error, and the app is opened as '/#/'
        $urlRouterProvider.otherwise(function ($injector) {
            var $state = $injector.get('$state');
            $state.go(config.states.default);
        });

        $stateProvider

            .state('home', {
                url: config.urls.pages.home,
                abstract: true,
                views: {
                    'header@': {
                        templateUrl: config.urls.views.header,
                        controller: 'NavigationBarController as vm'
                    },
                    'authenticationBar@home': {
                        templateUrl: config.urls.views.authenticationBar,
                        controller: 'AuthenticationBarController as vm',
                        resolve: {
                            profile: resolvers.profile.getCurrent
                        }
                    },
                    'footer@': {
                        templateUrl: config.urls.views.footer,
                        controller: 'NavigationBarController as vm'
                    }
                }
            })

            .state(config.states.default, {
                url: config.urls.pages.main,
                views: {
                    '@': {
                        templateUrl: config.urls.views.main,
                        controller: 'MainController as vm'
                    }
                }
            })

            .state(config.states.dashboard, {
                url: config.urls.pages.dashboard + ':boardId',
                views: {
                    '@': {
                        templateUrl: config.urls.views.dashboard,
                        controller: 'DashboardController as vm',
                        resolve: {
                            profile: resolvers.profile.getCurrent,
                            dashboard: resolvers.dashboard.getCurrent
                        }
                    }
                }
            })

            .state(config.states.support, {
                url: config.urls.pages.support,
                views: {
                    '@': {
                        templateUrl: config.urls.views.support,
                        controller: 'SupportController as vm',
                        resolve: {
                            profile: resolvers.profile.getCurrent
                        }
                    }
                }
            })

            .state(config.states.guides, {
                url: config.urls.pages.guides,
                views: {
                    '@': {
                        templateUrl: config.urls.views.guides,
                        controller: 'GuidesController as vm',
                        resolve: {
                            profile: resolvers.profile.getCurrent
                        }
                    }
                }
            })

            .state(config.states.profile, {
                url: config.urls.pages.profile,
                views: {
                    '@': {
                        templateUrl: config.urls.views.profile,
                        controller: 'ProfileController as vm',
                        resolve: {
                            profile: resolvers.profile.getCurrent
                        }
                    }
                }
            })

    }

    angular.module('dashboard').config(['$stateProvider', '$urlRouterProvider', 'config', 'resolvers', ConfigureRoutes]);
})(window.angular);