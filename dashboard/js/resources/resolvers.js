/**
 * Created by dmytroshchurov on 22/09/16.
 */
(function (angular) {
    'use strict';

    angular.module('dashboard.resources')
        .constant('resolvers', {
            profile: {
                getCurrent: ['$q', '$timeout', 'profileRepository', 'config', function ($q, $timeout, profileRepository, config) {
                    var deferred = $q.defer();

                    $timeout(function () {
                        deferred.resolve({name: 'John'});
                    });

                    return deferred.promise;
                }]
            },
            dashboard: {
                getCurrent: ['$q', '$timeout', 'dashboardRepository', 'config', function ($q, $timeout, dashboardRepository, config) {
                    var deferred = $q.defer();

                    $timeout(function () {
                        deferred.resolve({
                            stripes: [
                                {
                                    widgets: [{name: 'Session S/E'}]
                                },
                                {
                                    widgets: [{name: 'Visits'}, {name: 'Traffic/Conversion'}, {name: 'HP Visits'}, {name: 'Created Features'}]
                                }]
                        });
                    });

                    return deferred.promise;
                }]

            }
        });
})(window.angular);