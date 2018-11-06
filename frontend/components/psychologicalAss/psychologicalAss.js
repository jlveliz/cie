/**
    EVALICACIÓN PSICOLÓGICA 
**/

define(['app', 'moment'], function(app, moment) {

    app.register.service('PsyChoService', ['$uibModal', '$q', function($uibModal, $q) {
        var _this = this;
        _this.messageFlag = {};

        _this.statusCivil = [
            { id: 1, value: 'Casados' },
            { id: 2, value: 'Divorciados' },
            { id: 3, value: 'Separados' },
            { id: 4, value: 'Unión Libre' },
            { id: 5, value: 'Solteros' },
        ];

        _this.schoolingParents = [
            { id: 'ninguna', value: 'Ninguna' },
            { id: 'Primaria', value: 'Primaria' },
            { id: 'secundaria', value: 'Secundaria' },
            { id: 'superior', value: 'Superior' }
        ];

        _this.getGenre = function(genre) {
            if (!genre) return '';
            if (genre == 'M') {
                return 'Masculino';
            } else {
                return "Femenino";
            }
        };

        _this.getSchoolingUserType = function(schoolingTypeVal) {
            var schoolingType = '';
            angular.forEach(_this.schoolingType, function(item) {
                if (item.id == schoolingTypeVal) schoolingType = item.value;
            })
            return schoolingType;
        };

        _this.getPatientUserLocalization = function(model) {
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
        };

        _this.getPatientUserMother = function(mother) {
            var stringMother = '';
            if (mother.last_name) stringMother += mother.last_name;
            if (mother.name) stringMother += ' ' + mother.name;
            return stringMother;
        }

        _this.getPatientUserFather = function(father) {
            var stringFather = '';
            if (father.last_name) stringFather += father.last_name;
            if (father.name) stringFather += ' ' + father.name;
            return stringFather;
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
                case 'schooling':
                    stringRet = model.schooling == 3 ? 'NO POSEE' : _this.getSchoolingUserType(model.schooling_type) + ' ' + model.schooling_name;
                    break;
                case 'localization':
                    stringRet = _this.getPatientUserLocalization(model);
                    break;
                case 'diagnostic':
                    stringRet = model.diagnostic_id ? model.diagnostic.name : 'NO POSEE';
                    break;
                case 'mother':
                    stringRet = model.has_mother ? _this.getPatientUserMother(model.mother) : 'NO POSEE';
                    break;
                case 'father':
                    stringRet = model.has_father ? _this.getPatientUserFather(model.father) : 'NO POSEE';
                    break;
                case 'date_eval':
                    stringRet = moment(model.date_eval).format('YYYY-MM-DD');
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

    app.register.controller('PsychologicalAssIdxCtrl', ['$scope', 'apiResource', 'DTOptionsBuilder', 'PsyChoService', '$rootScope', '$state',function($scope, apiResource, DTOptionsBuilder, PsyChoService, $rootScope,$state) {

        $scope.models = [];
        $scope.loading = true;
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

        apiResource.resource('psycho-assessments').query().then(function(results) {
            $scope.loading = false;
            $scope.models = results;
            $scope.messages = PsyChoService.messageFlag;
            if (!_.isEmpty($scope.messages)) {
                $scope.hasMessage = true;
                PsyChoService.messageFlag = {};
            }
        });

        $scope.delete = function(id) {
            apiResource.resource('psycho-assessments').getCopy(id).then(function(object) {
                var params = {
                    title: 'Atención',
                    text: 'Desea eliminar la Evaluación de ' + object.patient_user.last_name + ' ' + object.patient_user.name + '.?'
                }
                $rootScope.openDeleteModal(params).then(function() {
                    var idx = _.findIndex($scope.models, function(el) {
                        return el.id == object.id;
                    });
                    if (idx > -1) {
                        $scope.models[idx].$deleting = true;
                        object.$delete(function() {
                            PsyChoService.messageFlag.title = "Evaluación eliminada correctamente";
                            PsyChoService.messageFlag.type = "info";
                            $scope.messages = PsyChoService.messageFlag;
                            $scope.hasMessage = true;
                            $scope.models[idx].$deleting = false;
                            $scope.models.splice(idx, 1);
                            apiResource.resource('psycho-assessments').removeFromCache(object.id);
                        })
                    }
                })
            });
        };

        $scope.goCreate = function() {
            $state.go('root.psychoAssessment.create')
        }
    }]);

    app.register.controller('PsychologicalAssCreateCtrl', ['$scope', 'apiResource', 'PsyChoService', '$state', '$rootScope', function($scope, apiResource, PsyChoService, $state, $rootScope) {

        $scope.isEdit = false;
        $scope.loading = true;
        $scope.saving = false;
        $scope.existError = false;
        $scope.existPatientUserSelected = false;
        $scope.statusCivil = PsyChoService.statusCivil;
        $scope.schoolingParents = PsyChoService.schoolingParents;
        $scope.messages = {};
        $scope.model = apiResource.resource('psycho-assessments').create({
            date_eval: new Date(),
            patientUser: {
                genre: ''
            },
            physical_level_is_left_right_both_hand: "derecho"
        });

        $scope.loading = false;

        $scope.validateOptions = {
            rules: {
                date_eval: {
                    required: true
                },
                call_user_in_home: {
                    required: true
                },
                age: {
                    required: true
                }
            },
            messages: {
                date_eval: {
                    required: 'Fecha de Evaluación requerida'
                },
                call_user_in_home: {
                    required: 'Ingrese como lo llaman en casa'
                },
                age: {
                    required: 'Ingrese una edad'
                }
            }
        };

        $scope.openModalSearchUser = function() {
            //when press aceptar on modal
            var params = {
                resource: 'psycho-assessments'
            }
            $rootScope.openModalSearchUser(params).then(function(patientUser) {
                $scope.existPatientUserSelected = true;
                $scope.model.patientUser = patientUser;
                $scope.model.patientUser.name = PsyChoService.formatPatientUser('name', $scope.model.patientUser);
                $scope.model.patientUser.genre = PsyChoService.formatPatientUser('genre', $scope.model.patientUser);
                $scope.model.patientUser.date_birth = PsyChoService.formatPatientUser('dbirth', $scope.model.patientUser);
                $scope.model.patientUser.schooling = PsyChoService.formatPatientUser('schooling', $scope.model.patientUser);
                $scope.model.patientUser.place_birth = PsyChoService.formatPatientUser('localization', $scope.model.patientUser);
                $scope.model.patientUser.diagnostic = PsyChoService.formatPatientUser('diagnostic', $scope.model.patientUser);
                $scope.model.mother_name = PsyChoService.formatPatientUser('mother', $scope.model.patientUser);
                $scope.model.mother_age = $scope.model.patientUser.has_mother ? $scope.model.patientUser.mother.age : '';
                $scope.model.father_name = PsyChoService.formatPatientUser('father', $scope.model.patientUser);
                $scope.model.father_age = $scope.model.patientUser.has_father ? $scope.model.patientUser.father.age : '';
                $scope.model.patient_user_id = patientUser.id;
            });
        };


        $scope.save = function(saveForm, returnIndex) {

            var successCallback = function(data) {
                $scope.saving = false;
                $scope.hasMessage = true;
                apiResource.resource('psycho-assessments').setOnCache(data);
                PsyChoService.messageFlag.title = "Entrevista psicológica de  " + $scope.model.patient_user.name + " Ingresada correctamente";
                PsyChoService.messageFlag.type = "info";
                $scope.messages = PsyChoService.messageFlag;
                if (returnIndex) {
                    $state.go('root.psychoAssessment');
                } else {
                    $state.go('root.psychoAssessment.edit', {
                        psychoAssId: data.id
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
                console.log($scope.model)
                PsyChoService.save($scope.model).then(successCallback, failCallback);
            }
        };

        $scope.saveAndClose = function(form) {
            $scope.save(form, true);
        };

        $scope.goIndex = function() {
            $state.go('root.psychoAssessment')
        }
    }]);

    app.register.controller('PsychologicalAssEditCtrl', ['$scope', '$stateParams', '$state', 'apiResource', 'PsyChoService', function($scope, $stateParams, $state, apiResource, PsyChoService) {

        $scope.loading = true;
        $scope.isEdit = true;
        $scope.model = {};
        var psychoAssId = $stateParams.psychoAssId;
        $scope.saving = false;
        $scope.existError = false;
        $scope.existPatientUserSelected = true;
        $scope.statusCivil = PsyChoService.statusCivil;
        $scope.schoolingParents = PsyChoService.schoolingParents;
        $scope.messages = {};


        $scope.validateOptions = {
            rules: {
                date_eval: {
                    required: true
                },
                call_user_in_home: {
                    required: true
                },
                age: {
                    required: true
                }
            },
            messages: {
                date_eval: {
                    required: 'Fecha de Evaluación requerida'
                },
                call_user_in_home: {
                    required: 'Ingrese como lo llaman en casa'
                },
                age: {
                    required: 'Ingrese una edad'
                }
            }
        };

        apiResource.resource('psycho-assessments').getCopy(psychoAssId).then(function(result) {
            $scope.model = result;
            $scope.model.patientUser = result.patient_user;
            $scope.model.date_eval = PsyChoService.formatPatientUser('date_eval', $scope.model);
            $scope.model.patientUser.name = PsyChoService.formatPatientUser('name', $scope.model.patientUser);
            $scope.model.patientUser.genre = PsyChoService.formatPatientUser('genre', $scope.model.patientUser);
            $scope.model.patientUser.date_birth = PsyChoService.formatPatientUser('dbirth', $scope.model.patientUser);
            $scope.model.patientUser.schooling = PsyChoService.formatPatientUser('schooling', $scope.model.patientUser);
            $scope.model.patientUser.place_birth = PsyChoService.formatPatientUser('localization', $scope.model.patientUser);
            $scope.model.patientUser.diagnostic = PsyChoService.formatPatientUser('diagnostic', $scope.model.patientUser);
            $scope.model.mother_name = PsyChoService.formatPatientUser('mother', $scope.model.patientUser);
            $scope.model.mother_age = $scope.model.patientUser.has_mother ? $scope.model.patientUser.mother.age : '';
            $scope.model.father_name = PsyChoService.formatPatientUser('father', $scope.model.patientUser);
            $scope.model.father_age = $scope.model.patientUser.has_father ? $scope.model.patientUser.father.age : '';
            $scope.loading = false;
        }, function(error) {
            if (error.status == 404) {
                $state.go('root.psychoAssessment');
            }
        });


        $scope.save = function(saveForm, returnIndex) {

            var successCallback = function(data) {
                $scope.saving = false;
                $scope.hasMessage = true;
                apiResource.resource('psycho-assessments').setOnCache(data);
                PsyChoService.messageFlag.title = "Entrevista psicológica de  " + $scope.model.patient_user.name + " ha sido actualizada correctamente";
                PsyChoService.messageFlag.type = "info";
                $scope.messages = PsyChoService.messageFlag;
                if (returnIndex) {
                    $state.go('root.psychoAssessment');
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
                PsyChoService.save($scope.model).then(successCallback, failCallback);
            }
        };

        $scope.saveAndClose = function(form) {
            $scope.save(form, true);
        };

        $scope.goIndex = function() {
            $state.go('root.psychoAssessment')
        }


    }]);

});