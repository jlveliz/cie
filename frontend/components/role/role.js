/**
 ** Role controller
 **/
define(['app'], function(app) {


    app.register.service('RoleService', ['apiResource', function(apiResource) {

        var _this = this;

        _this.messageFlag = {};

        _this.matchPermissions = function(modules, listPermissions) {
            angular.forEach(modules, function(module) {
                module.permissions = [];
                angular.forEach(listPermissions, function(perm) {

                    perm.$selected = false;

                    if (perm.module_id == module.id) {
                        module.permissions.push(perm);
                    }
                })
            });
            return modules;
        };

        _this.formatPermissionsGroup = function(permissions) {
            var arrayPermissions = [];
            angular.forEach(permissions, function(item) {
                arrayPermissions.push(item.id);
            })
            return arrayPermissions;

        }

        /**
            update is_default field in array (roles) if is default (model) is selected after to save
        **/
        _this.updateDefaultValue = function(idModel) {
            apiResource.resource('roles').query().then(function(results) {
                var grFiltered = _.reject(results, function(item) {
                    return item.id == idModel;
                });

                angular.forEach(grFiltered, function(group) {
                    group.is_default = '0';
                })
            })

        }

        _this.filterTypePermission = function(value, type, type2) {
            if ( (value && value.type.code == type) || (value && value.type.code == type2)) return value;
            return false
        }
    }]);

    app.register.controller('RoleIdxCtrl', ['$scope', 'apiResource', '$stateParams', 'DTOptionsBuilder', 'RoleService', '$rootScope', '$state', function($scope, apiResource, $stateParams, DTOptionsBuilder, RoleService, $rootScope, $state) {

        $scope.roles = [];
        $scope.loading = true;
        $scope.dtOptions = DTOptionsBuilder.newOptions().withBootstrap();
        $scope.messages = {};
        $scope.hasMessage = false;

        angular.extend($scope.dtOptions, {
            orderable: false,
            columnDefs: [{
                orderable: false,
                targets: 4
            }],
            order: [
                [0, 'asc'],
                [1, 'asc'],
                [2, 'asc'],
                [3, 'asc'],
            ],
            responsive: true
        });

        apiResource.resource('roles').queryCopy().then(function(results) {

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
                $rootScope.openDeleteModal(params).then(function() {
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
                            $scope.roles[idx].$deleting = false;
                            $scope.roles.splice(idx, 1);
                            apiResource.resource('roles').removeFromCache(object.id);
                        })
                    }
                })
            });
        }

        $scope.goCreate = function() {
            $state.go('root.role.create');
        }

    }]);

    app.register.controller('RoleCreateCtrl', ['$scope', 'apiResource', '$stateParams', '$state', 'RoleService', '$q', function($scope, apiResource, $stateParams, $state, RoleService, $q) {

        $scope.loading = true;
        $scope.saving = false;
        $scope.model = {};
        $scope.modules = [];
        var listPermissions = [];
        $scope.messages = [];

        var deps = $q.all([
            apiResource.resource('modules').queryCopy().then(function(modules) {
                $scope.modules = modules;
            }),
            apiResource.resource('permissions').queryCopy().then(function(permissions) {
                listPermissions = permissions;
                angular.forEach(listPermissions, function(per) {
                    per.$selected = false;
                })
            })
        ]);

        deps.then(function() {
            $scope.modules = RoleService.matchPermissions($scope.modules, listPermissions);

            $scope.model = apiResource.resource('roles').create({ is_default: '0', permissions: [] });
            $scope.loading = false;
        });



        $scope.validateOptions = {
            rules: {
                code: {
                    required: true,
                    unique: 'role,code'
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
                code: {
                    required: "El código es requerido",
                    unique: 'El código ya fue tomado'
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

        $scope.setPermission = function(permissionId, selected) {
            if (!selected) {
                var idx = _.indexOf($scope.model.permissions, permissionId);
                if (idx > -1) $scope.model.permissions.splice(idx, 1);
            } else {

                $scope.model.permissions.push(permissionId);
            }
        }

        $scope.checkPermission = function(permissionId) {
            var fPermission = _.find($scope.model.permissions, function(el) {
                return el == permissionId
            });
            if (fPermission) return true;
            return false;
        }

        $scope.filterTypePermissionMenu = function(value) {
            return RoleService.filterTypePermission(value, 'MENU','menu');
        }

        $scope.filterTypePermissionOption = function(value) {
            return RoleService.filterTypePermission(value, 'OPCION','opcion');
        }

        $scope.save = function(form, returnIndex) {
            $scope.messages = {};
            if (form.validate()) {
                $scope.saving = true;
                $scope.model.$save(function(data) {
                    if (data.is_default == '1') {
                        needUpdate = RoleService.updateDefaultValue(data.id);
                    }
                    apiResource.resource('roles').setOnCache(data);
                    RoleService.messageFlag.title = "Rol creado correctamente";
                    RoleService.messageFlag.type = "info";
                    if (returnIndex) {
                        $state.go('root.role');
                    } else {
                        $state.go('root.role.edit', {
                            roleId: data.id
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

        $scope.goIndex = function() {
            $state.go('root.role');
        }

    }]);

    app.register.controller('RoleEditCtrl', ['$scope', 'apiResource', '$stateParams', '$state', 'RoleService', '$q', function($scope, apiResource, $stateParams, $state, RoleService, $q) {

        var roleId = $stateParams.roleId;

        $scope.modules = [];
        var listPermissions = [];

        $scope.loading = true;
        $scope.model = {};
        $scope.messages = {};
        $scope.existError = false;

        var deps = $q.all([
            apiResource.resource('modules').queryCopy().then(function(modules) {
                $scope.modules = modules;
            }),
            apiResource.resource('permissions').queryCopy().then(function(permissions) {
                listPermissions = permissions;
            })
        ]);

        deps.then(function() {
            apiResource.resource('roles').getCopy(roleId).then(function(model) {
                $scope.modules = RoleService.matchPermissions($scope.modules, listPermissions);
                $scope.model = model;
                $scope.model.permissions = RoleService.formatPermissionsGroup($scope.model.permissions);
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
                code: {
                    required: true,
                    unique: 'role,code,' + roleId
                },
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
                    unique: 'module,name,' + roleId
                },
                description: {
                    required: true,
                }
            },
            messages: {
                code: {
                    required: "El código es requerido",
                    unique: 'El código ya fue tomado'
                },
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

        $scope.setPermission = function(permissionId, selected) {
            if (!selected) {
                var idx = _.indexOf($scope.model.permissions, permissionId);
                if (idx > -1) $scope.model.permissions.splice(idx, 1);
            } else {
                $scope.model.permissions.push(permissionId);
            }
        }

        $scope.checkPermission = function(permissionId, permissionModule) {
            var fPermission = _.find($scope.model.permissions, function(el) {
                return el == permissionId
            });
            if (fPermission) {
                //hacking :v
                permissionModule.$selected = true;
                return true;

            }
            return false;
        }

        $scope.filterTypePermissionMenu = function(value) {
            return RoleService.filterTypePermission(value, 'menu','MENU');
        }

        $scope.filterTypePermissionOption = function(value) {
            return RoleService.filterTypePermission(value, 'opcion','OPCION');
        }


        $scope.save = function(form, returnIndex) {
            $scope.messages = {};
            if (form.validate()) {
                $scope.saving = true;
                $scope.model.key = roleId;
                $scope.model.$update(roleId, function(data) {
                    if (data.is_default == '1') {
                        RoleService.updateDefaultValue(data.id);
                    }
                    $scope.hasMessage = true;
                    apiResource.resource('roles').setOnCache(data);
                    apiResource.resource('roles').getCopy(data.id).then(function(copyRe) {
                        $scope.model = copyRe;
                        $scope.model.permissions = RoleService.formatPermissionsGroup($scope.model.permissions);
                        RoleService.messageFlag.title = "Rol " + $scope.model.name + " Actualizado correctamente";
                        RoleService.messageFlag.type = "info";
                        $scope.messages = RoleService.messageFlag;
                        $scope.saving = false;
                        if (returnIndex) {
                            $state.go('root.role');
                        }
                    });
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

        $scope.goIndex = function() {
            $state.go('root.role');
        }

    }]);


});