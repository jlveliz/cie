/**
 ** Permission controller
 **/
define(['app'], function(app) {

    app.register.service('PermissionService', function() {

        var _this = this;

        _this.messageFlag = {};
    })

    app.register.controller('PermissionIdxCtrl', ['$scope', 'apiResource', '$stateParams', 'DTOptionsBuilder', 'PermissionService', '$rootScope', function($scope, apiResource, $stateParams, DTOptionsBuilder, PermissionService, $rootScope) {

        $scope.permissions = [];
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
            ],
            responsive: true
        });

        apiResource.resource('permissions').query().then(function(results) {
            $scope.loading = false;
            $scope.permissions = results;
            $scope.messages = PermissionService.messageFlag;
            if (!_.isEmpty($scope.messages)) {
                $scope.hasMessage = true;
                PermissionService.messageFlag = {};
            }
        });

        $scope.delete = function(id) {
            apiResource.resource('permissions').getCopy(id).then(function(object) {
                var params = {
                    title: 'Atención',
                    text: 'Desea eliminar el módulo ' + object.name + '.?'
                }
                $rootScope.openDelteModal(params).then(function() {
                    var idx = _.findIndex($scope.permissions, function(el) {
                        return el.id == object.id;
                    });
                    if (idx > -1) {
                        $scope.permissions[idx].$deleting = true;
                        object.$delete(function() {
                            PermissionService.messageFlag.title = "Módulo eliminado correctamente";
                            PermissionService.messageFlag.type = "info";
                            $scope.messages = PermissionService.messageFlag;
                            $scope.hasMessage = true;
                            $scope.permissions.splice(idx, 1);
                            apiResource.resource('permissions').removeFromCache(object.id);
                            $scope.permissions[idx].$deleting = false;
                        })
                    }
                })
            });
        }

    }]);

    app.register.controller('PermissionCreateCtrl', ['$scope', 'apiResource', '$stateParams', '$state', 'PermissionService', '$q', function($scope, apiResource, $stateParams, $state, PermissionService, $q) {

        $scope.loading = true;
        $scope.saving = false;
        $scope.model = {};
        $scope.modules = [];
        $scope.tPermissions = [];
        $scope.listpermissions = [];
        $scope.messages = [];

        var deps = $q.all([
            apiResource.resource('modules').queryCopy().then(function(modules) {
                $scope.modules = modules;
            }),
            apiResource.resource('tpermissions').queryCopy().then(function(tPermissions) {
                $scope.tPermissions = tPermissions;
            }),
        ]);

        deps.then(function() {
            $scope.model = apiResource.resource('permissions').create();
            $scope.loading = false;
        })



        $scope.validateOptions = {
            rules: {
                module_id: {
                    required: true,
                    valueNotEquals: '?',
                    exists: 'module'
                },
                type_id: {
                    required: true,
                    valueNotEquals: '?',
                    exists: 'permission_type'
                },
                name: {
                    required: true,
                    unique: 'module,name'
                },
                description: {
                    required: true,
                }
            },
            messages: {
                module_id: {
                    required: "El módulo es requerido",
                    valueNotEquals: "El módulo es requerido",
                    exists: 'El módulo es inválido'
                },
                type_id: {
                    required: "El tipo es requerido",
                    valueNotEquals: "El tipo es requerido",
                    exists: 'El tipo es inválido'
                },
                name: {
                    required: "Nombre requerido",
                    unique: 'El módulo ya fue tomado'
                },
                description: {
                    required: "La descripción es requerida",
                }
            }

        };

        $scope.save = function(form, returnIndex) {
            $scope.messages = {};
            if (form.validate()) {
                $scope.saving = true;
                $scope.model.$save(function(data) {
                    apiResource.resource('permissions').setOnCache(data);
                    PermissionService.messageFlag.title = "Módulo creado correctamente";
                    PermissionService.messageFlag.type = "info";
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

    app.register.controller('PermissionEditCtrl', ['$scope', 'apiResource', '$stateParams', '$state', 'PermissionService', '$q', function($scope, apiResource, $stateParams, $state, PermissionService, $q) {

        var permissionId = $stateParams.permissionId;

        $scope.modules = [];
        $scope.tPermissions = [];
        $scope.loading = true;
        $scope.model = {};
        $scope.messages = {};
        $scope.existError = false;

        var deps = $q.all([
            apiResource.resource('modules').queryCopy().then(function(modules) {
                $scope.modules = modules;
            }),
            apiResource.resource('tpermissions').queryCopy().then(function(tPermissions) {
                $scope.tPermissions = tPermissions;
            }),
        ]);

        deps.then(function() {
            apiResource.resource('permissions').getCopy(permissionId).then(function(model) {
                $scope.model = model;
                $scope.messages = PermissionService.messageFlag;
                if (!_.isEmpty($scope.messages)) {
                    $scope.hasMessage = true;
                    PermissionService.messageFlag = {};
                }
                $scope.loading = false;
            });
        })


        $scope.validateOptions = {
            rules: {
                module_id: {
                    required: true,
                    valueNotEquals: '?',
                    exists: 'module'
                },
                type_id: {
                    required: true,
                    valueNotEquals: '?',
                    exists: 'permission_type'
                },
                name: {
                    required: true,
                    unique: 'module,name,' + permissionId
                },
                description: {
                    required: true,
                }
            },
            messages: {
                module_id: {
                    required: "El módulo es requerido",
                    valueNotEquals: "El módulo es requerido",
                    exists: 'El módulo es inválido'
                },
                type_id: {
                    required: "El tipo es requerido",
                    valueNotEquals: "El tipo es requerido",
                    exists: 'El tipo es inválido'
                },
                name: {
                    required: "Nombre requerido",
                    unique: 'El módulo ya fue tomado'
                },
                description: {
                    required: "La descripción es requerida",
                }
            }

        };

        $scope.save = function(form, returnIndex) {
            $scope.messages = {};
            if (form.validate()) {
                $scope.saving = true;
                $scope.model.key = permissionId;
                $scope.model.$update(permissionId, function(data) {
                    $scope.saving = false;
                    $scope.hasMessage = true;
                    apiResource.resource('permissions').setOnCache(data);
                    PermissionService.messageFlag.title = "Módulo " + $scope.model.name + " Actualizado correctamente";
                    PermissionService.messageFlag.type = "info";
                    $scope.messages = PermissionService.messageFlag;
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