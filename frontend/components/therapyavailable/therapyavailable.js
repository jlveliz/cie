/**
 ** Therapy available controller
 **/
define(['app'], function(app) { 


	app.register.service('TherapyAvailableService', ['apiResource', function(apiResource) {
		var _this = this;

        _this.messageFlag = {};
	}]);


	app.register.controller('RoleIdxCtrl', ['$scope', 'apiResource', '$stateParams', 'DTOptionsBuilder', 'RoleService', '$rootScope', '$state', function($scope, apiResource, $stateParams, DTOptionsBuilder, RoleService, $rootScope, $state) { }])




})
