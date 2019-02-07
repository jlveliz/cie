/**
    EVALICACIÓN FÍSICA 
**/

define(['app', 'moment'], function(app, moment) {

    app.register.service('PysicalService', ['$uibModal', '$q', function($uibModal, $q) {

        var _this = this;
        _this.messageFlag = {};

        _this.formatPatientUser = function(format, model) {
            if (!format) return false;
            var stringRet = '';
            switch (format) {
                case 'name':
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

    app.register.controller('PhysicalAssIdxCtrl', ['$scope', 'apiResource', 'DTOptionsBuilder', 'PysicalService', '$rootScope', '$state', 'envService', function($scope, apiResource, DTOptionsBuilder, PysicalService, $rootScope, $state, envService) {

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


        $scope.print = function(id) {
            apiResource.resource('physical-assessments').getCopy({ id: id, noCache: true }).then(function(result) {
                var params = {
                    type: 'pdf',
                    content: envService.read('api') + 'physical-assessments/print/' + id,
                    title: result.patient_user.last_name + ' ' + result.patient_user.name
                };
                $rootScope.openPreviewModal(params);
            });
        }


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

    app.register.controller('PhysicalAssCreateCtrl', ['$scope', 'apiResource', 'DTOptionsBuilder', 'PysicalService', '$state', '$rootScope', function($scope, apiResource, DTOptionsBuilder, PysicalService, $state, $rootScope) {

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

            $rootScope.openModalSearchUser(params).then(function(patientUser) {
                $scope.existPatientUserSelected = true;
                $scope.model.patientUser = patientUser;
                $scope.model.patientUser.name = PysicalService.formatPatientUser('name', $scope.model.patientUser);
                $scope.model.patientUser.date_birth = PysicalService.formatPatientUser('dbirth', $scope.model.patientUser);
                $scope.model.patientUser.diagnostic = PysicalService.formatPatientUser('diagnostic', $scope.model.patientUser);
                // $scope.model.created_at = new moment();
                $scope.model.creator = $rootScope.currentUser.person.last_name + ' ' + $rootScope.currentUser.person.name;
                $scope.model.user_created_id = $rootScope.currentUser.id;
                $scope.model.date_eval = new moment().format('YYYY-MM-DD');
                $scope.model.hour_created_at = new moment().format('HH:mm');
                $scope.model.patient_user_id = patientUser.id;
            })
        };

        $scope.validateOptions = {
            rules: {
                'position[]': {
                    required: true,
                    minlength: 1
                },
                'muscular_tone_general[]': {
                    required: true,
                    minlength: 1
                },
                cephalic_control: {
                    required: true
                },
                'column[]': {
                    required: true,
                    minlength: 1
                },
                'muscular_tone_down[]': {
                    required: true,
                    minlength: 1
                }
            },
            messages: {
                'position[]': {
                    required: 'Seleccione al menos una postura o describa una',
                    minlength: 'Seleccione al menos una postura o describa una'
                },
                'muscular_tone_general[]': {
                    required: 'Seleccione al menos un tono múscular o describa una',
                    minlength: 'Seleccione al menos un tono múscular o describa una'
                },
                cephalic_control: {
                    required: true
                },
                'column[]': {
                    required: 'Seleccione al menos una opción',
                    minlength: 'Seleccione al menos una opción',
                },
                'muscular_tone_down[]': {
                    required: 'Seleccione al menos una opción',
                    minlength: 'Seleccione al menos una opción'
                }
            }
        }

        $scope.goIndex = function() {
            $state.go('root.physicalAssessment')
        }

        $scope.save = function(saveForm, returnIndex) {

            var successCallback = function(data) {
                $scope.saving = false;
                $scope.hasMessage = true;
                apiResource.resource('physical-assessments').setOnCache(data);
                PysicalService.messageFlag.title = "Valoración física de  " + $scope.model.patient_user.name + " Ingresada correctamente";
                PysicalService.messageFlag.type = "info";
                $scope.messages = PysicalService.messageFlag;
                if (returnIndex) {
                    $state.go('root.physicalAssessment');
                } else {
                    $state.go('root.physicalAssessment.edit', {
                        physicalAssId: data.id
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
                delete $scope.model.patientUser;
                PysicalService.save($scope.model).then(successCallback, failCallback);
            }
        }


        $scope.saveAndClose = function(saveForm) {
            $scope.save(saveForm, true);
        }


    }])

    app.register.controller('PhysicalAssEditCtrl', ['$scope', 'apiResource', 'DTOptionsBuilder', 'PysicalService', '$state', '$stateParams', function($scope, apiResource, DTOptionsBuilder, PysicalService, $state, $stateParams) {

        $scope.loading = true;
        $scope.isEdit = true;
        $scope.model = {};
        var physicalAssId = $stateParams.physicalAssId;
        $scope.saving = false;
        $scope.existError = false;
        $scope.hasMessage = false;
        $scope.existPatientUserSelected = true;
        $scope.messages = {};

        $scope.validateOptions = {
            rules: {
                'position[]': {
                    required: true,
                    minlength: 1
                },
                'muscular_tone_general[]': {
                    required: true,
                    minlength: 1
                },
                cephalic_control: {
                    required: true
                },
                'column[]': {
                    required: true,
                    minlength: 1
                },
                'muscular_tone_down[]': {
                    required: true,
                    minlength: 1
                }
            },
            messages: {
                'position[]': {
                    required: 'Seleccione al menos una postura o describa una',
                    minlength: 'Seleccione al menos una postura o describa una'
                },
                'muscular_tone_general[]': {
                    required: 'Seleccione al menos un tono múscular o describa una',
                    minlength: 'Seleccione al menos un tono múscular o describa una'
                },
                cephalic_control: {
                    required: true
                },
                'column[]': {
                    required: 'Seleccione al menos una opción',
                    minlength: 'Seleccione al menos una opción',
                },
                'muscular_tone_down[]': {
                    required: 'Seleccione al menos una opción',
                    minlength: 'Seleccione al menos una opción'
                }
            }
        }


        $scope.goIndex = function() {
            $state.go('root.physicalAssessment')
        };


        $scope.model = apiResource.resource('physical-assessments').get({ id: physicalAssId, noCache: true })
            .then(function(result) {
                $scope.model = result;
                $scope.model.patientUser = $scope.model.patient_user;
                $scope.existPatientUserSelected = true;
                $scope.model.patientUser.name = PysicalService.formatPatientUser('name', $scope.model.patientUser);
                $scope.model.patientUser.date_birth = PysicalService.formatPatientUser('dbirth', $scope.model.patientUser);
                $scope.model.patientUser.diagnostic = PysicalService.formatPatientUser('diagnostic', $scope.model.patientUser);
                $scope.model.user_created_id = (typeof $scope.model.creator == 'string') ? $scope.model.user_created_id : $scope.model.creator.id ;
                $scope.model.creator = (typeof $scope.model.creator == 'object') ? $scope.model.creator.person.name + ' ' + $scope.model.creator.person.last_name : $scope.model.creator;
                
                $scope.model.hour_created_at = new moment($scope.model.created_at).format('HH:mm');
                $scope.loading = false;
               

                $scope.messages = PysicalService.messageFlag;
                if (!_.isEmpty($scope.messages)) {
                    $scope.hasMessage = true;
                    PysicalService.messageFlag = {};
                }
            }, function(error) {
                if (error.status == 404) {
                    $state.go('root.physicalAssessment');
                }
            });


        $scope.save = function(saveForm, returnIndex) {

            var successCallback = function(data) {
                $scope.saving = false;
                $scope.hasMessage = true;

                PysicalService.messageFlag.title = "Valoración física de  " + $scope.model.patient_user.name + " Actualizada correctamente";
                PysicalService.messageFlag.type = "info";
                $scope.messages = PysicalService.messageFlag;
                if (returnIndex) {
                    $state.go('root.physicalAssessment');
                }
                //reset

                $scope.model = data;
                $scope.model.patientUser = $scope.model.patient_user;
                $scope.existPatientUserSelected = true;
                $scope.model.patientUser.name = PysicalService.formatPatientUser('name', $scope.model.patientUser);
                $scope.model.patientUser.date_birth = PysicalService.formatPatientUser('dbirth', $scope.model.patientUser);
                $scope.model.patientUser.diagnostic = PysicalService.formatPatientUser('diagnostic', $scope.model.patientUser);
                // $scope.model.user_created_id = $scope.model.creator.id;

                $scope.model.creator = $scope.model.creator.person.name + ' ' + $scope.model.creator.person.last_name;
                $scope.model.hour_created_at = new moment($scope.model.created_at).format('HH:mm');
                console.log(data);
                apiResource.resource('physical-assessments').setOnCache(data);
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
                delete $scope.model.patientUser;
                PysicalService.save($scope.model).then(successCallback, failCallback);
            }
        }

        $scope.saveAndClose = function(saveForm) {
            $scope.save(saveForm, true)
        }


    }])
})