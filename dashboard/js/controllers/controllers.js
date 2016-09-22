/**
 * Created by dmytroshchurov on 22/09/16.
 */
(function (angular, undefined) {
    'use strict';

    function NavigationBarController($scope, $state, message, config){
        var vm = this;

        var setActivePage = function (name) {
            vm.activePage = {};
            vm.activePage[name] = true;
        };

        setActivePage($state.current.name);

        message.subscribe(config.messages.stateChanged, function (event, from, to) {
            setActivePage(to.name);
        }, $scope);
    }

    function AuthenticationBarController($scope, message, config, profile){
        var vm = this;

        vm.userAuthenticated = true;
        vm.profile = profile;

        message.subscribe(config.messages.userSignedOut, function () {
            vm.profile = {};
            vm.userAuthenticated = false;
        }, $scope);
    }

    function MainController(){
        var vm = this;
    }

    function SupportController(){
        var vm = this;
    }

    function GuidesController(){
        var vm = this;
    }

    function ProfileController(){
        var vm = this;
    }

    function DashboardController(dashboard){
        var vm = this;

        vm.dashboard = dashboard;
    }

    angular.module('dashboard.controllers', ['dashboard.services', 'dashboard.configuration', 'dashboard.resources', 'dashboard.filters',
        'ui.bootstrap', 'toaster'])
        .controller('NavigationBarController', ['$scope', '$state','message', 'config', NavigationBarController])
        .controller('AuthenticationBarController', ['$scope', 'message', 'config', 'profile', AuthenticationBarController])
        .controller('MainController', [MainController])
        .controller('SupportController', [SupportController])
        .controller('GuidesController', [GuidesController])
        .controller('ProfileController', [ProfileController])
        .controller('DashboardController', ['dashboard', DashboardController]);
})
(window.angular);