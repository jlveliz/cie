/**
    EVALICACIÓN PSICOLÓGICA 
**/

define(['app', 'moment'], (app, moment) => {

    app.register.directive('changeOption', ['$compile', function($compile) {
        return {
            restrict: 'C',
            link: function(scope, iElement, iAttrs) {

                angular.element(iElement).on('change', function(event) {
                    var htmlNameField = "<input id='query-criteria-name' type='text' class='form-control' placeholder='APELLIDOS NOMBRES' ng-model='model.queryCriteria' ng-disabled='searching'/>";
                    var htmlIdField = "<input id='query-criteria-dni' type='text' maxlength='10' minlength='10' ng-model='model.queryCriteria' class='form-control' placeholder='0999999999' numbers-only ng-disabled='searching'> ";

                    scope.$apply(function() {
                        if (scope.criteria == '0') {
                            angular.element("#query-criteria-dni").remove();
                            var compiled = $compile(htmlNameField)(scope)
                            angular.element('.place-input').removeClass('col-md-6').append(compiled);
                            angular.element('query-criteria-name').focus();
                        } else {
                            angular.element("#query-criteria-name").remove();
                            var compiled = $compile(htmlIdField)(scope);
                            angular.element('.place-input').addClass('col-md-6').append(compiled);
                            angular.element('query-criteria-dni').focus();

                        }
                    });
                });


            }
        };
    }])

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


        _this.openModalSearchUser = function() {
            var deferred = $q.defer();
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: false,
                templateUrl: 'frontend/components/psychologicalAss/search-user.html',
                resolve: {
                    modalContent: function() {
                        return parent;
                    }
                },
                controller: function($scope, $http, envService, $uibModalInstance) {
                    $scope.criteria = "1";
                    $scope.existError = false;
                    $scope.model = { queryCriteria: '', errors: '' };
                    $scope.users = [];
                    $scope.searching = false;
                    $scope.searchCriteria = {
                        num_idetification: true,
                        names: false
                    };

                    $scope.search = function() {
                        $scope.searching = true;
                        $scope.existError = false;
                        $scope.users = [];
                        var params = "num_identification=";
                        //if search by name
                        if ($scope.criteria == '0') params = 'name=';
                        $http.get(envService.read('api') + 'pUsers?' + params + $scope.model.queryCriteria).then(function(res) {
                            value = base64.decode(res.data);
                            var val = JSON.parse(value);
                            if (!val.length) {
                                $scope.users.push(val);
                            } else {
                                angular.forEach(val, function(element, index) {
                                    $scope.users.push(element);
                                });
                            }
                            $scope.searching = false;
                        }, function(err) {
                            $scope.model.errors = err.data.message;
                            $scope.existError = true;
                            $scope.searching = false;
                        })
                    }

                    $scope.selectAndClose = function(patientUser) {
                        $uibModalInstance.close()
                        deferred.resolve(patientUser);
                    }

                }

            });
            return deferred.promise;
        };

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

    app.register.controller('PsychologicalAssIdxCtrl', ['$scope', 'apiResource', 'DTOptionsBuilder', 'PsyChoService', function($scope, apiResource, DTOptionsBuilder, PsyChoService) {

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
                    text: 'Desea eliminar la Evaluación de ' + object.user.name + ' ' + object.user.last_name + '.?'
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


    }]);

    app.register.controller('PsychologicalAssCreateCtrl', ['$scope', 'apiResource', 'PsyChoService', '$state', function($scope, apiResource, PsyChoService, $state) {

        $scope.isEdit = false;
        $scope.loading = true;
        $scope.saving = false;
        $scope.existError = false;
        $scope.existPatientUserSelected = false;
        $scope.statusCivil = PsyChoService.statusCivil;
        $scope.schoolingParents = PsyChoService.schoolingParents;
        $scope.model = apiResource.resource('psycho-assessments').create({
            date_eval: new Date(),
            patientUser: {
                genre: ''
            }
        });
        $scope.loading = false;

        $scope.openModalSearchUser = function() {
            //when press aceptar on modal
            PsyChoService.openModalSearchUser().then(function(patientUser) {
                $scope.existPatientUserSelected = true;
                $scope.model.patientUser = patientUser;
                $scope.model.patientUser.name = $scope.model.patientUser.last_name + ' ' + $scope.model.patientUser.name;
                $scope.model.patientUser.genre = $scope.model.patientUser.genre == 'M' ? 'Masculino' : 'Femenino';
                $scope.model.patientUser.date_birth = moment($scope.model.patientUser.date_birth).format('YYYY-MM-DD');
                $scope.model.patientUser.schooling = $scope.model.patientUser.schooling == 3 ? 'NO POSEE' : PsyChoService.getSchoolingUserType($scope.model.patientUser.schooling_type) + ' ' + $scope.model.patientUser.schooling_name;
                $scope.model.patientUser.place_birth = $scope.model.patientUser.province.name + ' - ' + $scope.model.patientUser.city.name + ' - ' + $scope.model.patientUser.parish.name;
                $scope.model.patientUser.diagnostic = $scope.model.patientUser.diagnostic_id ? $scope.model.patientUser.diagnostic.name : 'NO POSEE';
                $scope.model.mother_name = $scope.model.patientUser.has_mother ? $scope.model.patientUser.mother.last_name + ' ' + $scope.model.patientUser.mother.last_name : '';
                $scope.model.mother_age = $scope.model.patientUser.has_mother ? $scope.model.patientUser.mother.age : '';
                $scope.model.father_name = $scope.model.patientUser.has_father ? $scope.model.patientUser.father.last_name + ' ' + $scope.model.patientUser.father.last_name : '';
                $scope.model.father_age = $scope.model.patientUser.has_father ? $scope.model.patientUser.father.age : '';
                $scope.model.patient_user_id = patientUser.id;
            });
        };


        $scope.save = function(saveForm, returnIndex) {

            var successCallback = function(data) {
                $scope.saving = false;
                $scope.hasMessage = true;
                apiResource.resource('psycho-assessments').setOnCache(data);
                PsyChoService.messageFlag.title = "Entrevista psicológica de  " + $scope.model.patientUser.name + " Ingresada correctamente";
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
                // $scope.changeRepresentant();
                PsyChoService.save($scope.model).then(successCallback, failCallback);
            }

        };

        $scope.saveAndClose = function(form) {
            $scope.save(form, true);
        }


    }]);

    app.register.controller('PsychologicalAssEditCtrl', ['$scope', function($scope) {

    }]);

});