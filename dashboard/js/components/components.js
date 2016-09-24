/**
 * Created by dmytroshchurov on 22/09/16.
 */
(function (angular) {
    'use strict';

    function ExaNavigationBarController($rootScope, $state, underscore) {
        var ctrl = this;

        ctrl.nodes = [];

        function buildNavigationBar(stateName) {
            var names = stateName.split('.');
            ctrl.nodes = underscore.map(names, function (i) {
                return {title: i};
            });
        };

        ctrl.$onInit = function () {
            buildNavigationBar($state.current.name);

            $rootScope.$on('$stateChangeSuccess',
                function (event, toState) {
                    buildNavigationBar(toState.name);
                });

        };
    }

    angular.module('dashboard.components', [])
        .component('exaPageTitle',
        {
            transclude: true,
            templateUrl: 'templates/components/exa-page-title.html'
        })
        .component('exaNavigationBar',
        {
            transclude: false,
            templateUrl: 'templates/components/exa-navigation-bar.html',
            controller: ['$rootScope', '$state', 'underscore', ExaNavigationBarController]
        });

})
(window.angular);