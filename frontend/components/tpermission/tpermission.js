/**
 ** TPermission controller
 **/
define(['app'], function(app) {

    app.register.service('TPermissionService', function() {

        var _this = this;

        _this.messageFlag = {};
    })

    app.register.controller('TPermissionIdxCtrl', ['$scope', 'apiResource', '$stateParams', 'DTOptionsBuilder', 'TPermissionService', '$rootScope', function($scope, apiResource, $stateParams, DTOptionsBuilder, TPermissionService, $rootScope) {

        $scope.tpermissions = [];
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

        apiResource.resource('tpermissions').query().then(function(results) {
            $scope.loading = false;
            $scope.tpermissions = results;
            $scope.messages = TPermissionService.messageFlag;
            if (!_.isEmpty($scope.messages)) {
                $scope.hasMessage = true;
                TPermissionService.messageFlag = {};
            }
        });

        $scope.delete = function(id) {
            apiResource.resource('tpermissions').getCopy(id).then(function(object) {
                var params = {
                    title: 'Atención',
                    text: 'Desea eliminar el tipo de permiso ' + object.name + '.?'
                }
                $rootScope.openDelteModal(params).then(function() {
                    var idx = _.findIndex($scope.tpermissions, function(el) {
                        return el.id == object.id;
                    });
                    if (idx > -1) {
                        $scope.tpermissions[idx].$deleting = true;
                        object.$delete(function() {
                            TPermissionService.messageFlag.title = "Tipo de permiso eliminado correctamente";
                            TPermissionService.messageFlag.type = "info";
                            $scope.messages = TPermissionService.messageFlag;
                            $scope.hasMessage = true;
                            $scope.tpermissions[idx].$deleting = false;
                            $scope.tpermissions.splice(idx, 1);
                            apiResource.resource('tpermissions').removeFromCache(object.id);
                        })
                    }
                })
            });
        }

    }]);

    app.register.controller('TPermissionCreateCtrl', ['$scope', 'apiResource', '$stateParams', '$state', 'TPermissionService', function($scope, apiResource, $stateParams, $state, TPermissionService) {

        $scope.saving = false;
        $scope.model = {};
        $scope.listPermissions = [];
        $scope.messages = [];


        $scope.model = apiResource.resource('tpermissions').create();

        $scope.validateOptions = {
            rules: {
                name: {
                    required: true,
                    unique: 'permission_type,name'
                }
            },
            messages: {
                name: {
                    required: "Campo requerido",
                    unique: 'El Tipo de permiso ya fué tomado'
                }
            }

        };

        $scope.save = function(form, returnIndex) {
            $scope.messages = {};
            if (form.validate()) {
                $scope.saving = true;
                $scope.model.$save(function(data) {
                    apiResource.resource('tpermissions').setOnCache(data);
                    TPermissionService.messageFlag.title = "Tipo de permiso creado correctamente";
                    TPermissionService.messageFlag.type = "info";
                    if (returnIndex) {
                        $state.go('root.tpermission');
                    } else {
                        $state.go('root.tpermission.edit', {
                            tPermissionId: data.id
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

    app.register.controller('TPermissionEditCtrl', ['$scope', 'apiResource', '$stateParams', '$state', 'TPermissionService', function($scope, apiResource, $stateParams, $state, TPermissionService) {

        var tpermissionId = $stateParams.tPermissionId;


        $scope.loading = true;
        $scope.model = {};
        $scope.messages = {};
        $scope.existError = false;

        apiResource.resource('tpermissions').getCopy(tpermissionId).then(function(model) {
            $scope.model = model;
            $scope.messages = TPermissionService.messageFlag;
            if (!_.isEmpty($scope.messages)) {
                $scope.hasMessage = true;
                TPermissionService.messageFlag = {};
            }
            $scope.loading = false;
        });

        $scope.validateOptions = {
            rules: {
                name: {
                    required: true,
                    unique: 'permission_type,name,' + tpermissionId
                }
            },
            messages: {
                name: {
                    required: "Campo requerido",
                    unique: 'El Tipo de Permiso ya fué tomado'
                }
            }

        };

        $scope.save = function(form, returnIndex) {
            $scope.messages = {};
            if (form.validate()) {
                $scope.saving = true;
                $scope.model.key = tpermissionId;
                $scope.model.$update(tpermissionId, function(data) {
                    $scope.saving = false;
                    $scope.hasMessage = true;
                    apiResource.resource('tpermissions').setOnCache(data);
                    TPermissionService.messageFlag.title = "Tipo de permiso " + $scope.model.name + " Actualizado correctamente";
                    TPermissionService.messageFlag.type = "info";
                    $scope.messages = TPermissionService.messageFlag;
                    if (returnIndex) {
                        $state.go('root.tpermission');
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