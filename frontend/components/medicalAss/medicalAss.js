'use strict';

define(['app', 'moment'], function(app, moment) {



    app.register.service('MedicalAssService', ['$uibModal', '$q', function($uibModal, $q) {

        var _this = this;
        _this.messageFlag = {};

        _this.answersClosed = [
            { value: 1, label: 'Si' },
            { value: 0, label: 'No' },
        ];

        _this.getPatientUserProcedence = function(model) {
            var localization = '';
            if (model.province) {
                localization += model.province.name;
            }

            if (model.city) {
                localization += ' - ' + model.city.name;
            }

            if (model.parish) {
                localization += ' - ' + model.parish.name;
            }
            return localization;
        }

        _this.formatPatientUser = function(format, model) {
            if (!format) return false;
            var stringRet = '';
            switch (format) {
                case 'name':
                    stringRet = model.last_name + ' ' + model.name;
                    break;
                case 'genre':
                    stringRet = model.genre == 'M' ? 'Masculino' : 'Femenino';
                    break;
                case 'dbirth':
                    stringRet = model.date_birth ? moment(model.date_birth).format('YYYY-MM-DD') : '';
                    break;
                case 'procedence':
                    stringRet = _this.getPatientUserProcedence(model);;
                    break;
                default:
                    // statements_def
                    break;
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


    app.register.controller('MedicalAssIdxCtrl', ['$scope', 'apiResource', 'DTOptionsBuilder', 'MedicalAssService', '$rootScope', '$state', function($scope, apiResource, DTOptionsBuilder, MedicalAssService, $rootScope, $state) {

        $scope.loading = true;
        $scope.models = [];
        $scope.dtOptions = DTOptionsBuilder.newOptions().withBootstrap();
        $scope.messages = {};
        $scope.hasMessage = false;

        angular.extend($scope.dtOptions, {
            orderable: false,
            columnDefs: [{
                orderable: false,
                targets: 2
            }],
            order: [
                [0, 'asc'],
                [1, 'asc'],
            ],
            responsive: true,
        });

        apiResource.resource('medical-assessments').query().then(function(results) {
            $scope.loading = false;
            $scope.models = results;
            $scope.messages = MedicalAssService.messageFlag;
            if (!_.isEmpty($scope.messages)) {
                $scope.hasMessage = true;
                MedicalAssService.messageFlag = {};
            }
        });

        $scope.delete = function(id) {
            apiResource.resource('medical-assessments').getCopy(id).then(function(object) {
                var params = {
                    title: 'Atención',
                    text: 'Desea eliminar la valoración médica de ' + object.patient_user.last_name + ' ' + object.patient_user.name + '.?'
                }
                $rootScope.openDeleteModal(params).then(function() {
                    var idx = _.findIndex($scope.models, function(el) {
                        return el.id == object.id;
                    });
                    if (idx > -1) {
                        $scope.models[idx].$deleting = true;
                        object.$delete(function() {
                            MedicalAssService.messageFlag.title = "Entrevista médica eliminada correctamente";
                            MedicalAssService.messageFlag.type = "info";
                            $scope.messages = MedicalAssService.messageFlag;
                            $scope.hasMessage = true;
                            $scope.models[idx].$deleting = false;
                            $scope.models.splice(idx, 1);
                            apiResource.resource('medical-assessments').removeFromCache(id);
                        })
                    }
                })
            });
        };

        $scope.goCreate = function() {
            $state.go('root.medicalAssessment.create')
        }


    }]);

    //create
    app.register.controller('MedicalAssCreateCtrl', ['$scope', 'MedicalAssService', 'apiResource', '$rootScope', '$state', function($scope, MedicalAssService, apiResource, $rootScope, $state) {

        $scope.loading = true;
        $scope.saving = false;
        $scope.existError = false;
        $scope.existPatientUserSelected = false;
        $scope.messages = {};
        $scope.answersClosed = MedicalAssService.answersClosed;



        $scope.model = apiResource.resource('medical-assessments').create({
            date_eval: new Date(),
            patientUser: {
                genre: ''
            }
        });

        $scope.loading = false;

        $scope.validateOptions = {
            rules: {

            },
            messages: {

            }
        }

        $scope.openModalSearchUser = function() {
            let params = { resource: 'medical-assessments' };
            $rootScope.openModalSearchUser(params).then(function(patientUser) {
                $scope.existPatientUserSelected = true;
                $scope.model.patientUser = patientUser;
                $scope.model.patientUser.name = MedicalAssService.formatPatientUser('name', $scope.model.patientUser);
                $scope.model.patientUser.genre = MedicalAssService.formatPatientUser('genre', $scope.model.patientUser);
                $scope.model.patientUser.date_birth = MedicalAssService.formatPatientUser('dbirth', $scope.model.patientUser);
                $scope.model.patientUser.personal_data_procedence = MedicalAssService.formatPatientUser('procedence', $scope.model.patientUser);
                $scope.model.patient_user_id = patientUser.id;
            });
        };

        $scope.save = function(saveForm, returnIndex) {

            var successCallback = function(data) {
                $scope.saving = false;
                $scope.hasMessage = true;
                apiResource.resource('medical-assessments').setOnCache(data);
                MedicalAssService.messageFlag.title = "Entrevista médica de  " + $scope.model.patient_user.name + " Ingresada correctamente";
                MedicalAssService.messageFlag.type = "info";
                $scope.messages = MedicalAssService.messageFlag;
                if (returnIndex) {
                    $state.go('root.medicalAssessment');
                } else {
                    $state.go('root.medicalAssessment.edit', {
                        assesId: data.id
                    })
                }
            }

            var failCallback = function(reason) {
                $scope.saving = false
                $scope.existError = true;
                $scope.messages.title = reason.data.title;
                $scope.messages.type = 'error';
                $scope.messages.details = [];
                var json = JSON.parse(reason.data.detail);
                angular.forEach(json, function(elem, idx) {
                    angular.forEach(elem, function(el, idex) {
                        $scope.messages.details.push(el)
                    })
                })
            }

            if (saveForm.validate()) {
                $scope.saving = true;
                MedicalAssService.save($scope.model).then(successCallback, failCallback);
            }
        };

        $scope.saveAndClose = function(saveForm) {
            $scope.save(form, true);
        }

        $scope.goIndex = function() {
            $state.go('root.medicalAssessment')
        }


    }]);

    //edit
    app.register.controller('MedicalAssEditCtrl', ['$scope', 'MedicalAssService', '$state', '$stateParams', 'apiResource', function($scope, MedicalAssService, $state, $stateParams, apiResource) {

        $scope.loading = true;
        $scope.saving = false;
        $scope.existError = false;
        $scope.isEdit = true;
        var assesId = $stateParams.assesId;
        $scope.existPatientUserSelected = true;
        $scope.messages = {};
        $scope.model = {};
        $scope.answersClosed = MedicalAssService.answersClosed;

        $scope.validateOptions = {
            rules: {

            },
            messages: {

            }
        };

        apiResource.resource('medical-assessments').getCopy(assesId).then(function(model) {
            $scope.model = model;
            $scope.model.patientUser = model.patient_user;
            $scope.model.patientUser.name = MedicalAssService.formatPatientUser('name', model.patient_user);
            $scope.model.patientUser.age = model.patient_user.age;
            $scope.model.patientUser.genre = MedicalAssService.formatPatientUser('genre', model.patient_user);
            $scope.model.patientUser.date_birth = MedicalAssService.formatPatientUser('dbirth', model.patient_user);
            $scope.model.patientUser.personal_data_procedence = MedicalAssService.formatPatientUser('procedence', model.patient_user);
            $scope.model.patient_user_id = model.patient_user.id;
            $scope.loading = false;
        });

        $scope.save = function(saveForm, returnIndex) {

            var successCallback = function(data) {
                $scope.saving = false;
                $scope.hasMessage = true;
                apiResource.resource('medical-assessments').setOnCache(data);
                $scope.model.patientUser = {};
                $scope.model.patientUser.name = MedicalAssService.formatPatientUser('name', data.patient_user);
                $scope.model.patientUser.genre = MedicalAssService.formatPatientUser('genre', data.patient_user);
                $scope.model.patientUser.date_birth = MedicalAssService.formatPatientUser('dbirth', data.patient_user);
                $scope.model.patientUser.personal_data_procedence = MedicalAssService.formatPatientUser('procedence', data.patient_user);
                MedicalAssService.messageFlag.title = "Entrevista médica de  " + data.patient_user.name + " ha sido actualizada correctamente";
                MedicalAssService.messageFlag.type = "info";
                $scope.messages = MedicalAssService.messageFlag;
                if (returnIndex) {
                    $state.go('root.medicalAssessment');
                }
            }

            var failCallback = function(reason) {
                $scope.saving = false
                $scope.existError = true;
                $scope.messages.title = reason.data.title;
                $scope.messages.type = 'error';
                $scope.messages.details = [];
                var json = JSON.parse(reason.data.detail);
                angular.forEach(json, function(elem, idx) {
                    angular.forEach(elem, function(el, idex) {
                        $scope.messages.details.push(el)
                    })
                })
            }

            if (saveForm.validate()) {
                $scope.saving = true;
                MedicalAssService.save($scope.model).then(successCallback, failCallback);
            }
        };

        $scope.saveAndClose = function(form) {
            $scope.save(form, true);
        };

         $scope.goIndex = function() {
            $state.go('root.medicalAssessment')
        }



    }]);


});