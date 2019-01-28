/**
 ** Schedule Maker controller
 **/
define(['app'], function(app) {

    app.register.service('ScheduleMakerService', ['apiResource', function(apiResource) {


        var _this = this;

        _this.messageFlag = {};


    }]);

    app.register.controller('ScheduleIdxCtrl', ['$scope', 'apiResource', '$stateParams', 'DTOptionsBuilder', 'ScheduleMakerService', '$rootScope', '$state', function($scope, apiResource, $stateParams, DTOptionsBuilder, ScheduleMakerService, $rootScope, $state) { 

    	$scope.loading = true;
    	$scope.schedules = [];

    	apiResource.resource('buildings').query().then(function(result) {
    		console.log(result)
    	})


    }])


})