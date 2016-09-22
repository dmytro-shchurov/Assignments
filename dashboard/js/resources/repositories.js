/**
 * Created by dmytroshchurov on 22/09/16.
 */
(function (angular) {
    'use strict';

    function ProfileRepository($resource, envConfig) {
        return $resource(envConfig.urls.api.base + envConfig.urls.api.profile, {}, {
                'query': {method: 'GET', isArray: false},
                'update': {method: 'PUT'}
            }
        );
    }

    function DashboardRepository($resource, envConfig) {
        return $resource(envConfig.urls.api.base + envConfig.urls.api.dashboard, {}, {
                'query': {method: 'GET', isArray: true},
                'create': {method: 'POST'},
                'delete': {method: 'DELETE'},
                'update': {method: 'PUT'}
            }
        );
    }

    angular.module('dashboard.resources', ['ngResource', 'dashboard.configuration'])
        .factory('profileRepository', ['$resource', 'environmentConfig', ProfileRepository])
        .factory('dashboardRepository', ['$resource', 'environmentConfig', DashboardRepository]);
})(window.angular);