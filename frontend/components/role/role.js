/**
 ** Role controller
 **/
define(['app'], function(app) {

    app.register.service('RoleService', function() {

        var _this = this;

        _this.messageFlag = {};
    })

    app.register.controller('RoleIdxCtrl', ['$scope', 'apiResource', '$stateParams', 'DTOptionsBuilder', 'RoleService', '$rootScope', function($scope, apiResource, $stateParams, DTOptionsBuilder, RoleService, $rootScope) {

        $scope.roles = [];
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

        apiResource.resource('roles').query().then(function(results) {
            $scope.loading = false;
            $scope.roles = results;
            $scope.messages = RoleService.messageFlag;
            if (!_.isEmpty($scope.messages)) {
                $scope.hasMessage = true;
                RoleService.messageFlag = {};
            }
        });

        $scope.delete = function(id) {
            apiResource.resource('roles').getCopy(id).then(function(object) {
                var params = {
                    title: 'Atención',
                    text: 'Desea eliminar el rol ' + object.name + '.?'
                }
                $rootScope.openDelteModal(params).then(function() {
                    var idx = _.findIndex($scope.roles, function(el) {
                        return el.id == object.id;
                    });
                    if (idx > -1) {
                        $scope.roles[idx].$deleting = true;
                        object.$delete(function() {
                            RoleService.messageFlag.title = "Rol eliminado correctamente";
                            RoleService.messageFlag.type = "info";
                            $scope.messages = RoleService.messageFlag;
                            $scope.hasMessage = true;
                            $scope.roles.splice(idx, 1);
                            apiResource.resource('roles').removeFromCache(object.id);
                            $scope.roles[idx].$deleting = false;
                        })
                    }
                })
            });
        }

    }]);

    app.register.controller('RoleCreateCtrl', ['$scope', 'apiResource', '$stateParams', '$state', 'RoleService', '$q', function($scope, apiResource, $stateParams, $state, RoleService, $q) {

        $scope.loading = true;
        $scope.saving = false;
        $scope.model = {};
        $scope.permissions = [];
        $scope.messages = [];

        var deps = $q.all([
            apiResource.resource('permissions').queryCopy().then(function(permissions) {
                $scope.permissions = permissions;
            }),
        ]);

        deps.then(function() {
            $scope.model = apiResource.resource('roles').create();
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
                    apiResource.resource('roles').setOnCache(data);
                    RoleService.messageFlag.title = "Permiso creado correctamente";
                    RoleService.messageFlag.type = "info";
                    if (returnIndex) {
                        $state.go('root.permission');
                    } else {
                        $state.go('root.permission.edit', {
                            permissionId: data.id
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

    app.register.controller('RoleEditCtrl', ['$scope', 'apiResource', '$stateParams', '$state', 'RoleService', '$q', function($scope, apiResource, $stateParams, $state, RoleService, $q) {

        var permissionId = $stateParams.permissionId;

        $scope.modules = [];
        $scope.tRoles = [];
        $scope.loading = true;
        $scope.model = {};
        $scope.messages = {};
        $scope.existError = false;

        var deps = $q.all([
            apiResource.resource('modules').queryCopy().then(function(modules) {
                $scope.modules = modules;
            }),
            apiResource.resource('troles').queryCopy().then(function(tRoles) {
                $scope.tRoles = tRoles;
            }),
        ]);

        deps.then(function() {
            apiResource.resource('roles').getCopy(permissionId).then(function(model) {
                $scope.model = model;
                $scope.messages = RoleService.messageFlag;
                if (!_.isEmpty($scope.messages)) {
                    $scope.hasMessage = true;
                    RoleService.messageFlag = {};
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
                    apiResource.resource('roles').setOnCache(data);
                    RoleService.messageFlag.title = "Permiso " + $scope.model.name + " Actualizado correctamente";
                    RoleService.messageFlag.type = "info";
                    $scope.messages = RoleService.messageFlag;
                    if (returnIndex) {
                        $state.go('root.permission');
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