/**
 * Created by dmytroshchurov on 22/09/16.
 */
(function (angular) {
    'use strict';

    String.prototype.fromJson = function () {
        return angular.fromJson(this);
    };


    angular.module('dashboard', ['ui.router', 'ui.bootstrap', 'toaster',
        'ngCookies', 'ngAnimate', 'ngSanitize',
        'dashboard.configuration', 'dashboard.components', 'dashboard.filters',
        'dashboard.controllers', 'dashboard.services', 'dashboard.resources']);
})(window.angular);