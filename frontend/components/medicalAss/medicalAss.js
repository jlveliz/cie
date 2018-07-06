'use strict';

require(['app'], function(app) {



    app.register.service('MedicalAssService', ['$uibModal', function($uibModal) {
    	
    	var _this = this;
        _this.messageFlag = {};


    }]);


    // //Index
    app.register.controller('MedicalAssIdxCtrl', ['$scope', 'MedicalAssService', function($scope, MedicalAssService) {
    	console.log($scope)
    }]);

    // //create
    // app.register.controller('MedicalAssCreateCtrl', ['$scope', 'MedicalAssService', function($scope, MedicalAssService) {

    // }]);

    // //edit
    // app.register.controller('MedicalAssEditCtrl', ['$scope', 'MedicalAssService', function($scope, MedicalAssService) {

    // }]);


});