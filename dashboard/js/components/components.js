/**
 * Created by dmytroshchurov on 22/09/16.
 */
(function (angular) {
    'use strict';

    function ExaPageTitleDirective() {
        return {
            transclude: true,
            templateUrl: 'templates/components/exa-page-title.html'
        };
    }

    angular.module('dashboard.components', [])
        .component('exaPageTitle',
        {
            transclude: true,
            templateUrl: 'templates/components/exa-page-title.html'
        }
    );

})
(window.angular);