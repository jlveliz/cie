/**
 ** State Patient User controller
 **/
define(['app'], function(app) {

    app.register.service('StatePatientUserService', function(apiResource) {

        var _this = this;
        _this.messageFlag = {};

    });

    app.register.controller('StatePatientUserIdxCtrl', ['$scope', 'apiResource', '$stateParams', 'DTOptionsBuilder', 'StatePatientUserService', '$rootScope', '$state', function($scope, apiResource, $stateParams, DTOptionsBuilder, StatePatientUserService, $rootScope, $state) {

        $scope.states = [];
        $scope.loading = true;
        $scope.dtOptions = DTOptionsBuilder.newOptions().withBootstrap();
        $scope.messages = {};
        $scope.hasMessage = false;

        angular.extend($scope.dtOptions, {
            orderable: false,
            columnDefs: [{
                orderable: false,
                targets: 3
            }],
            order: [
                [0, 'asc'],
                [1, 'asc'],
                [2, 'asc'],
            ],
            responsive: true
        });

        apiResource.resource('stapatients').query().then(function(results) {
            $scope.loading = false;
            $scope.states = results;
            $scope.messages = StatePatientUserService.messageFlag;
            if (!_.isEmpty($scope.messages)) {
                $scope.hasMessage = true;
                StatePatientUserService.messageFlag = {};
            }
        });

        $scope.delete = function(id) {
            apiResource.resource('stapatients').getCopy(id).then(function(object) {
                var params = {
                    title: 'Atención',
                    text: 'Desea eliminar el estado de usuario  ' + object.name + '.?'
                }
                $rootScope.openDeleteModal(params).then(function() {
                    var idx = _.findIndex($scope.states, function(el) {
                        return el.id == object.id;
                    });
                    if (idx > -1) {
                        $scope.states[idx].$deleting = true;
                        object.$delete(function() {
                            StatePatientUserService.messageFlag.title = "Estado de Usuario P se ha eliminado correctamente";
                            StatePatientUserService.messageFlag.type = "info";
                            $scope.messages = StatePatientUserService.messageFlag;
                            $scope.hasMessage = true;
                            $scope.states[idx].$deleting = false;
                            $scope.states.splice(idx, 1);
                            apiResource.resource('stapatients').removeFromCache(id);
                        })
                    }
                })
            });
        };

        $scope.goToCreate = function() {
            $state.go('root.stapatients.create')
        }
    }]);


    app.register.controller('StatePatientUserCreateCtrl', ['$scope', 'apiResource', '$stateParams', '$state', 'StatePatientUserService', function($scope, apiResource, $stateParams, $state, StatePatientUserService) {

        $scope.saving = false;
        $scope.model = {};
        $scope.messages = [];

        $scope.model = apiResource.resource('stapatients').create();

        $scope.validateOptions = {
            rules: {
                name: {
                    required: true,
                    unique: 'state_patient_user,name'
                }
            },
            messages: {
                name: {
                    required: "Campo requerido",
                    unique: 'El nombre ya fue tomado'
                }
            }

        };


        $scope.save = function(form, returnIndex) {
            $scope.messages = {};
            if (form.validate()) {
                $scope.saving = true;
                $scope.model.$save(function(data) {
                    apiResource.resource('stapatients').setOnCache(data);
                    StatePatientUserService.messageFlag.title = "Estado de usuario P creada correctamente";
                    StatePatientUserService.messageFlag.type = "info";
                    if (returnIndex) {
                        $state.go('root.stapatients');
                    } else {
                        $state.go('root.stapatients.edit', {
                            statePaId: data.id
                        })
                    }


                }, function(reason) {
                    $scope.saving = false;
                    $scope.existError = true;
                    $scope.messages.title = reason.data.title;
                    $scope.messages.details = [];
                    var json = JSON.parse(reason.data.detail);
                    angular.forEach(json, function(elem, idx) {
                        angular.forEach(elem, function(el, idex) {
                            $scope.messages.details.push(el)
                        })
                    })
                });
            }
        }


        $scope.saveAndClose = function(form) {
            $scope.save(form, true);
        }

        $scope.goToIndex = function() {
            $state.go('root.stapatients')
        }


    }]);


    app.register.controller('StatePatientUserEditCtrl', ['$scope', 'apiResource', '$stateParams', '$state', 'StatePatientUserService', function($scope, apiResource, $stateParams, $state, StatePatientUserService) {

        var stateUserP = $stateParams.statePaId;
        $scope.isEdit = true;

        $scope.loading = true;
        $scope.model = {};
        $scope.messages = {};
        $scope.existError = false;

        apiResource.resource('stapatients').getCopy(stateUserP).then(function(model) {
            $scope.model = model;
            $scope.messages = StatePatientUserService.messageFlag;
            if (!_.isEmpty($scope.messages)) {
                $scope.hasMessage = true;
                StatePatientUserService.messageFlag = {};
            }
            $scope.loading = false;
        });

        $scope.validateOptions = {
            rules: {
                name: {
                    required: true,
                    unique: 'state_patient_user,name,' + stateUserP
                }
            },
            messages: {
                name: {
                    required: "Campo requerido",
                    unique: 'El nombre del estado de paciente ya fue tomado'
                }
            }

        };

        $scope.save = function(form, returnIndex) {
            $scope.messages = {};
            if (form.validate()) {
                $scope.saving = true;
                $scope.model.key = stateUserP;
                $scope.model.$update(stateUserP, function(data) {
                    $scope.saving = false;
                    $scope.hasMessage = true;
                    apiResource.resource('stapatients').setOnCache(data);
                    StatePatientUserService.messageFlag.title = "Estado de Usuario P " + $scope.model.name + " Actualizada correctamente";
                    StatePatientUserService.messageFlag.type = "info";
                    $scope.messages = StatePatientUserService.messageFlag;
                    if (returnIndex) {
                        $state.go('root.stapatients');
                    }
                }, function(reason) {
                    $scope.saving = false;
                    $scope.existError = true;
                    $scope.messages.title = reason.data.title;
                    $scope.messages.details = [];
                    var json = JSON.parse(reason.data.detail);
                    angular.forEach(json, function(elem, idx) {
                        angular.forEach(elem, function(el, idex) {
                            $scope.messages.details.push(el)
                        })
                    })
                });
            }
        }


        $scope.saveAndClose = function(form) {
            $scope.save(form, true);
        };

        $scope.goToIndex = function() {
            $state.go('root.stapatients')
        }

    }]);


});