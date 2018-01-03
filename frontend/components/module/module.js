/**
 ** Module controller
 **/
define(['app'], function(app) {

    app.register.service('ModuleService', function() {

        var _this = this;

        _this.messageFlag = {};
    })

    app.register.controller('ModuleIdxCtrl', ['$scope', 'apiResource', '$stateParams', 'DTOptionsBuilder', 'ModuleService', '$rootScope', function($scope, apiResource, $stateParams, DTOptionsBuilder, ModuleService, $rootScope) {

        $scope.modules = [];
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
            responsive: true
        });

        apiResource.resource('modules').query().then(function(results) {
            $scope.loading = false;
            $scope.modules = results;
            $scope.messages = ModuleService.messageFlag;
            if (!_.isEmpty($scope.messages)) {
                $scope.hasMessage = true;
                ModuleService.messageFlag = {};
            }
        });

        $scope.delete = function(id) {
            apiResource.resource('modules').getCopy(id).then(function(object) {
                var params = {
                    title: 'Atención',
                    text: 'Desea eliminar el módulo ' + object.name + '.?'
                }
                $rootScope.openDelteModal(params).then(function() {
                    var idx = _.findIndex($scope.modules, function(el) {
                        return el.id == object.id;
                    });
                    if (idx > -1) {
                        $scope.modules[idx].$deleting = true;
                        object.$delete(function() {
                            ModuleService.messageFlag.title = "Módulo eliminado correctamente";
                            ModuleService.messageFlag.type = "info";
                            $scope.messages = ModuleService.messageFlag;
                            $scope.hasMessage = true;
                            $scope.modules[idx].$deleting = false;
                            $scope.modules.splice(idx, 1);
                            apiResource.resource('modules').removeFromCache(object.id);
                        })
                    }
                })
            });
        }

    }]);

    app.register.controller('ModuleCreateCtrl', ['$scope', 'apiResource', '$stateParams', '$state', 'ModuleService', function($scope, apiResource, $stateParams, $state, ModuleService) {

        $scope.saving = false;
        $scope.model = {};
        $scope.listPermissions = [];
        $scope.messages = [];


        $scope.model = apiResource.resource('modules').create();

        $scope.validateOptions = {
            rules: {
                name: {
                    required: true,
                    unique: 'module,name'
                }
            },
            messages: {
                name: {
                    required: "Campo requerido",
                    unique: 'El módulo ya fue tomado'
                }
            }

        };

        $scope.save = function(form, returnIndex) {
            $scope.messages = {};
            if (form.validate()) {
                $scope.saving = true;
                $scope.model.$save(function(data) {
                    apiResource.resource('modules').setOnCache(data);
                    ModuleService.messageFlag.title = "Módulo creado correctamente";
                    ModuleService.messageFlag.type = "info";
                    if (returnIndex) {
                        $state.go('root.module');
                    } else {
                        $state.go('root.module.edit', {
                            moduleId: data.id
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

    }]);

    app.register.controller('ModuleEditCtrl', ['$scope', 'apiResource', '$stateParams', '$state', 'ModuleService', function($scope, apiResource, $stateParams, $state, ModuleService) {

        var moduleId = $stateParams.moduleId;


        $scope.loading = true;
        $scope.model = {};
        $scope.messages = {};
        $scope.existError = false;

        apiResource.resource('modules').getCopy(moduleId).then(function(model) {
            $scope.model = model;
            $scope.messages = ModuleService.messageFlag;
            if (!_.isEmpty($scope.messages)) {
                $scope.hasMessage = true;
                ModuleService.messageFlag = {};
            }
            $scope.loading = false;
        });

        $scope.validateOptions = {
            rules: {
                name: {
                    required: true,
                    unique: 'module,name,' + moduleId
                }
            },
            messages: {
                name: {
                    required: "Campo requerido",
                    unique: 'El módulo ya fue tomado'
                }
            }

        };

        $scope.save = function(form, returnIndex) {
            $scope.messages = {};
            if (form.validate()) {
                $scope.saving = true;
                $scope.model.key = moduleId;
                $scope.model.$update(moduleId, function(data) {
                    $scope.saving = false;
                    $scope.hasMessage = true;
                    apiResource.resource('modules').setOnCache(data);
                    ModuleService.messageFlag.title = "Módulo " + $scope.model.name + " Actualizado correctamente";
                    ModuleService.messageFlag.type = "info";
                    $scope.messages = ModuleService.messageFlag;
                    if (returnIndex) {
                        $state.go('root.module');
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

    }]);


});