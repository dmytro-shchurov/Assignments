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

    function ExaWidgetIconDirective($document, dashboard) {
        return {
            transclude: false,
            restrict: 'A',
            scope: true,
            link: function (scope, element) {
                scope.icon = dashboard.registerIcon();

                var startX = 0, startY = 0, x = 0, y = 0;

                function mousedown(event) {
                    // Prevent default dragging of selected content
                    event.preventDefault();
                    startX = event.pageX - x;
                    startY = event.pageY - y;
                    $document.on('mousemove', mousemove);
                    $document.on('mouseup', mouseup);

                    dashboard.iconCaptured(scope.icon);
                }

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

                    dashboard.iconReleased(scope.icon);

                    setInactive();
                }

                function setActive() {
                    element.addClass('active');
                }

                function setInactive() {
                    element.removeClass('active');
                }

                element.on('mousedown', mousedown);

                dashboard.on('accept', function (icon, placeholder) {
                    if (scope.icon.id !== icon.id)
                    {
                        return;
                    }

                    if (!placeholder) {
                        setInactive();
                    } else {
                        setActive();
                    }
                });
            }
        };
    }

    function ExaWidgetStripeDirective(dashboard) {
        return {
            transclude: false,
            restrict: 'A',
            link: function (scope, element) {

                var iconCaptured = null;

                function mouseenter() {
                    if (iconCaptured) {
                        dashboard.placeholderAccepting(iconCaptured, scope);  // scope is a temporary solution
                    }
                }

                function mouseup() {
                }

                function mouseleave() {
                    if (iconCaptured)
                        dashboard.placeholderAccepting(iconCaptured, false);
                }

                element.on('mouseenter', mouseenter);
                element.on('mouseleave', mouseleave);
                element.on('mouseup', mouseup);

                dashboard.on('capture', function (icon) {
                    iconCaptured = icon;
                });

                dashboard.on('release', function (icon) {
                    iconCaptured = null;
                });
            }
        }
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
        .directive('exaWidgetIcon', ['$document', 'dashboard', ExaWidgetIconDirective])
        .directive('exaWidgetStripe', ['dashboard', ExaWidgetStripeDirective]);

})
(window.angular);