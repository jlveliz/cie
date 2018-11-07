/**
    EVALICACIÓN FÍSICA 
**/

define(['app', 'moment'], function(app, moment) {

    app.register.service('PysicalService', ['$uibModal', '$q', function($uibModal, $q) {

        var _this = this;
        _this.messageFlag = {};

        _this.formatPatientUser = function(format,model) {
            if (!format) return false;
            var stringRet = '';
            switch(format) {
                case 'name' :
                    stringRet = model.last_name + ' ' + model.name;
                    break;
                case 'dbirth':
                    stringRet = model.date_birth ? moment(model.date_birth).format('YYYY-MM-DD') : '';
                    break;
                case 'diagnostic':
                    stringRet = model.diagnostic_id ? model.diagnostic.name : 'NO POSEE';
                    break
            }

            return stringRet;
        };

        _this.save = function(model) {

            var deferred = $q.defer();

            var successCallback = function(model) {
                deferred.resolve(model);
            }

            var failCallback = function(error) {
                deferred.reject(error);
            }

            if (model.id) {
                model.$update(model.id, successCallback, failCallback);
            } else {
                model.$save(successCallback, failCallback);
            }

            return deferred.promise;
        }

    }]);

    app.register.controller('PhysicalAssIdxCtrl', ['$scope', 'apiResource', 'DTOptionsBuilder', 'PysicalService', '$rootScope', '$state', function($scope, apiResource, DTOptionsBuilder, PysicalService, $rootScope, $state) {

        $scope.models = [];
        $scope.loading = true;
        $scope.dtOptions = DTOptionsBuilder.newOptions().withBootstrap();
        $scope.messages = {};
        $scope.hasMessage = false;

        apiResource.resource('physical-assessments').query().then((results) => {
            $scope.loading = false;
            $scope.models = results;
            $scope.messages = PysicalService.messageFlag;
            if (!_.isEmpty($scope.messages)) {
                $scope.hasMessage = true;
                PysicalService.messageFlag = {};
            }
        });


        $scope.delete = function(id) {
            apiResource.resource('physical-assessments').getCopy(id).then(function(object) {
                var params = {
                    title: 'Atención',
                    text: 'Desea eliminar la Evaluación Física de ' + object.patient_user.last_name + ' ' + object.patient_user.name + '.?'
                }
                $rootScope.openDeleteModal(params).then(function() {
                    var idx = _.findIndex($scope.models, function(el) {
                        return el.id == object.id;
                    });
                    if (idx > -1) {
                        $scope.models[idx].$deleting = true;
                        object.$delete(function() {
                            PysicalService.messageFlag.title = "Evaluación Física eliminada correctamente";
                            PysicalService.messageFlag.type = "info";
                            $scope.messages = PysicalService.messageFlag;
                            $scope.hasMessage = true;
                            $scope.models[idx].$deleting = false;
                            $scope.models.splice(idx, 1);
                            apiResource.resource('physical-assessments').removeFromCache(object.id);
                        })
                    }
                })
            });
        }

        $scope.goCreate = () => {
            $state.go('root.physicalAssessment.create');
        }

    }]);

    app.register.controller('PhysicalAssCreateCtrl', ['$scope', 'apiResource', 'DTOptionsBuilder', 'PysicalService', '$state','$rootScope',function($scope, apiResource, DTOptionsBuilder, PysicalService, $state,$rootScope) {

        $scope.loading = true;
        $scope.isEdit = false;
        $scope.saving = false;
        $scope.existError = false;
        $scope.messages = {};

        $scope.model = apiResource.resource('physical-assessments').create();
        $scope.loading = false;

        $scope.openModalSearchUser = function() {
            //when press aceptar on modal
            var params = {
                resource: 'physical-assessments'
            }

            $rootScope.openModalSearchUser(params).then(function(patientUser){
                $scope.existPatientUserSelected = true;
                $scope.model.patientUser = patientUser;
                $scope.model.patientUser.name = PysicalService.formatPatientUser('name',$scope.model.patientUser);
                $scope.model.patientUser.date_birth = PysicalService.formatPatientUser('dbirth',$scope.model.patientUser);
                $scope.model.patientUser.diagnostic = PysicalService.formatPatientUser('diagnostic',$scope.model.patientUser);
            })
        }

        $scope.goIndex = function() {
            $state.go('root.physicalAssessment')
        }

        $scope.save = function(saveForm,returnIndex) {
            console.log($scope.model)
            // if (saveForm.validate()) {
            //     $scope.saving = true;
            //     // PysicalService.save($scope.model).then(successCallback, failCallback);
            // }
        }


    }])

    app.register.controller('PhysicalAssEditCtrl', ['$scope', 'apiResource', 'DTOptionsBuilder', 'PysicalService', '$state', ($scope, apiResource, DTOptionsBuilder, PysicalService, $state) => {

    }])
})