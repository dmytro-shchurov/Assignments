/**
 * Created by dmytroshchurov on 22/09/16.
 */
(function (angular) {
    'use strict';

    function HttpApiInterceptor($q, authentication, flash, message, i18n, networkActivity, config) {
        var checkNotAuthorizedResponse = function (rejection) {
            return true;
        };

        var checkResourceValidationResponse = function (rejection) {
            return true;
        };

        var checkInternalServerError = function (rejection) {
            return true;
        };

        var checkResourceNotFound = function (rejection) {
            return true;
        };

        var checkRequestTimeout = function (rejection) {
            return true;
        };

        var checkBadRequest = function (rejection) {
            return true;
        };

        var checkResponseHasStatus = function (rejection) {
            return true;
        };

        var busyIndicatorSemaphore;

        var httpRequestStarted = function () {
            networkActivity.start();
        };

        var httpRequestCompleted = function () {
            networkActivity.end();
        };

        var httpApiRequestCompleted = function (response) {

            return response;
        };

        return {
            request: function (config) {
                httpRequestStarted();
                return config || $q.when(config);
            },
            requestError: function (rejection) {
                httpRequestCompleted();
                return $q.reject(rejection);
            },
            response: function (response) {
                httpRequestCompleted();

                httpApiRequestCompleted(response);

                return response || $q.when(response);
            },
            responseError: function (rejection) {
                httpRequestCompleted();

                if (!checkNotAuthorizedResponse(rejection) &&
                    !checkResourceValidationResponse(rejection) &&
                    !checkInternalServerError(rejection) &&
                    !checkResourceNotFound(rejection) &&
                    !checkRequestTimeout(rejection) &&
                    !checkBadRequest(rejection) &&
                    !checkResponseHasStatus(rejection) && (rejection.status > 0)) {

                    // then report generic network error
                    //
                    // notify error happened
                }
                return $q.reject(rejection);
            }
        };
    }

    function HttpTimeoutInterceptor(configuration) {
        return {
            'request': function (config) {
                config.timeout = configuration.network.timeout;
                return config;
            }
        };
    }

    function ConfigHttpBackend($compileProvider, $httpProvider, $provide, config) {

        // workaround for $httpProvider.defaults.timeout
        $provide.factory('httpTimeoutInterceptor', ['config', HttpTimeoutInterceptor]);

        $httpProvider.interceptors.push('httpTimeoutInterceptor');

        // CORS
        /*jshint -W051 */
        $httpProvider.defaults.useXDomain = true;
        $httpProvider.defaults.headers.common.Accept = 'application/json, text/html';
        delete $httpProvider.defaults.headers.common['X-Requested-With'];

        // register platform specific Uri schemas as 'safe'
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|tel|sms|mailto|maps|geo|comgooglemaps|itms-apps|market):/);

        $httpProvider.defaults.timeout = config.network.timeout;
        $httpProvider.defaults.withCredentials = true;
    }

    angular.module('dashboard').config(['$compileProvider', '$httpProvider', '$provide',
        'config',
        ConfigHttpBackend]);
})(window.angular);