/**
 * Created by dmytroshchurov on 22/09/16.
 */
(function (angular) {
    'use strict';

    function Run($scope, $window, $location, $state, message, config, application) {

        $scope.application = application();

        //xlatService.setCurrentLanguage($scope.application.locale);

        $scope.navigateBack = function () {
            $window.history.back();
        };

        $scope.navigate = function (path) {
            $location.path(path);
        };

        var stateHistory = [];  // array of {state, params, action} objects
        var stateCurrent = {};

        $scope.stateGoBack = function (options) {
            var backState = stateHistory.pop();

            if (backState) {
                var opts = angular.extend({}, options);
                $state.go(backState.state.name, backState.params, opts);
            }
        };

        $scope.stateGoReplace = function (url, params) {
            $state.go(url, params, {location: 'replace'});
        };

        $scope.stateReload = function () {
            $state.go(stateCurrent.state, stateCurrent.params, {reload: true});
        };

        $scope.safeApply = function (fn) {
            // this means caller $scope
            var phase = this.$root.$$phase;
            if (phase === '$apply' || phase === '$digest') {
                if (fn && (typeof(fn) === 'function')) {
                    fn();
                }
            } else {
                this.$apply(fn);
            }
        };

        $scope.$on('$stateChangeStart',
            function (event, toState, toParams, fromState) {

                message.publish(config.messages.stateChanging, fromState, toState);
            });

        $scope.$on('$stateChangeSuccess',
            function (event, toState, toParams, fromState, fromParams) {
                if (fromState.name && (
                    fromState.name !== config.states.signin &&
                    fromState.name !== config.states.signout)) {
                    stateHistory.push({state: fromState, params: fromParams, action: fromState.action});
                }

                stateCurrent = {state: toState, params: toParams};

                message.publish(config.messages.stateChanged, fromState, toState);
            });

        $scope.$on(config.messages.userAuthenticated, function (e, user) {
            message.publish(config.messages.sessionInitialized);
        });
    }

    angular.module('dashboard').run(['$rootScope', '$window', '$location',
        '$state', 'message', 'config', 'application', Run]);

})(window.angular);