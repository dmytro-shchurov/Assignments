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

    function ExaWidgetIconDirective($document){
        return {
            transclude: false,
            restrict: 'A',
            link: function (scope, element) {

                var startX = 0, startY = 0, x = 0, y = 0;

                element.on('mousedown', function (event) {
                    // Prevent default dragging of selected content
                    event.preventDefault();
                    startX = event.pageX - x;
                    startY = event.pageY - y;
                    $document.on('mousemove', mousemove);
                    $document.on('mouseup', mouseup);
                });

                function mousemove(event) {
                    y = event.pageY - startY;
                    x = event.pageX - startX;
                    element.css({
                        top: y + 'px',
                        left: x + 'px'
                    });
                }

                function mouseup() {
                    startX = startY = 0;
                    x = y = 0;
                    element.css({
                        top: '0px',
                        left: '0px'
                    });
                    $document.off('mousemove', mousemove);
                    $document.off('mouseup', mouseup);
                }
            }
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
        })
        // exaWidgetIcon is implemented as a directive to control restriction - extra tag is not willed
        .directive('exaWidgetIcon',['$document', ExaWidgetIconDirective]);

})
(window.angular);