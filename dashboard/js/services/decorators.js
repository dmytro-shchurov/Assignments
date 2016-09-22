/**
 * Created by dmytroshchurov on 22/09/16.
 */
(function (angular) {
    'use strict';

    function ToasterInvoke(toaster, config, $config) {
        this.config = angular.extend({
            timeout: $config.notification.timeToDisplay
        }, config);

        this.toaster = toaster;
        this.$config = $config;
    }

    ToasterInvoke.prototype.template = function (template, data) {
        data = angular.toJson(data);

        this.toaster.pop(angular.extend(this.config, {
            body: '{template: \'' + template + '\', data: ' + data + '}',
            bodyOutputType: this.$config.notification.format.template
        }));

        return this.toaster.toast.uid;
    };

    ToasterInvoke.prototype.html = function (body) {
        this.toaster.pop(angular.extend(this.config, {
            body: body,
            bodyOutputType: this.$config.notification.format.html
        }));

        return this.toaster.toast.uid;
    };

    function ToasterDecorator(toaster, config, $filter) {
        var toastId = 0;

        toaster.error = function (title) {
            return new ToasterInvoke(toaster, {
                type: config.notification.type.error,
                title: $filter('xlat')(title),
                toastId: ++toastId
            }, config);
        };

        toaster.success = function (title) {
            return new ToasterInvoke(toaster, {
                type: config.notification.type.success,
                title: $filter('xlat')(title),
                toastId: ++toastId
            }, config);
        };

        toaster.info = function (title) {
            return new ToasterInvoke(toaster, {
                type: config.notification.type.info,
                title: $filter('xlat')(title),
                toastId: ++toastId
            }, config);
        };

        toaster.warning = function (title) {
            return new ToasterInvoke(toaster, {
                type: config.notification.type.warning,
                title: $filter('xlat')(title),
                toastId: ++toastId
            }, config);
        };

        return toaster;
    }

    angular.module('dashboard')
        .config(['$provide', function ($provide) {
            $provide.decorator('toaster', ['$delegate', 'config', '$filter',
                ToasterDecorator]);
        }]);


})(window.angular);