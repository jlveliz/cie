/**
 ** City controller
 **/
define(['app'], function(app) {

    app.register.service('PerTypeService', function() {

        var _this = this;

        _this.messageFlag = {};
    })

    app.register.controller('PerTypeIdxCtrl', ['$scope', 'apiResource', '$stateParams', 'DTOptionsBuilder', 'PerTypeService', '$rootScope', function($scope, apiResource, $stateParams, DTOptionsBuilder, PerTypeService, $rootScope) {

        $scope.pertypes = [];
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

        apiResource.resource('pertypes').query().then(function(results) {
            $scope.loading = false;
            $scope.pertypes = results;
            $scope.messages = PerTypeService.messageFlag;
            if (!_.isEmpty($scope.messages)) {
                $scope.hasMessage = true;
                PerTypeService.messageFlag = {};
            }
        });

        $scope.delete = function(id) {
            apiResource.resource('pertypes').getCopy(id).then(function(object) {
                var params = {
                    title: 'Atención',
                    text: 'Desea eliminar el tipo de Persona ' + object.name + '.?'
                }
                $rootScope.openDeleteModal(params).then(function() {
                    var idx = _.findIndex($scope.pertypes, function(el) {
                        return el.id == object.id;
                    });
                    if (idx > -1) {
                        $scope.pertypes[idx].$deleting = true;
                        object.$delete(function() {
                            PerTypeService.messageFlag.title = "Tipo de Personapersona eliminada correctamente";
                            PerTypeService.messageFlag.type = "info";
                            $scope.messages = PerTypeService.messageFlag;
                            $scope.hasMessage = true;
                            $scope.pertypes[idx].$deleting = false;
                            $scope.pertypes.splice(idx, 1);
                            apiResource.resource('pertypes').removeFromCache(id);
                        })
                    }
                })
            });
        }
    }]);

    app.register.controller('PerTypeCreateCtrl', ['$scope', 'apiResource', '$stateParams', '$state', 'PerTypeService', '$q', function($scope, apiResource, $stateParams, $state, PerTypeService, $q) {

        $scope.saving = false;
        $scope.loading = true;
        $scope.model = {};
        $scope.listPermissions = [];
        $scope.messages = [];
        $scope.provinces = [];

        $scope.loading = false;
        $scope.model = apiResource.resource('pertypes').create();



        $scope.validateOptions = {
            rules: {
                name: {
                    required: true,
                    unique: 'person_type,name'
                },
            },
            messages: {
                name: {
                    required: "Campo requerido",
                    unique: 'El tipo de persona ya fue tomado'
                },
            }

        };

        $scope.save = function(form, returnIndex) {
            $scope.messages = {};
            if (form.validate()) {
                $scope.saving = true;
                $scope.model.$save(function(data) {
                    apiResource.resource('pertypes').setOnCache(data);
                    PerTypeService.messageFlag.title = "El Tipo de Persona fue creada correctamente";
                    PerTypeService.messageFlag.type = "info";
                    if (returnIndex) {
                        $state.go('root.pertypes');
                    } else {
                        $state.go('root.pertypes.edit', {
                            perTypeId: data.id
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

    app.register.controller('PerTypeEditCtrl', ['$scope', 'apiResource', '$stateParams', '$state', 'PerTypeService', '$q', function($scope, apiResource, $stateParams, $state, PerTypeService, $q) {

        var perTypeId = $stateParams.perTypeId;
        $scope.isEdit = true;

        $scope.loading = true;
        $scope.model = {};
        $scope.messages = {};
        $scope.existError = false;


        apiResource.resource('pertypes').getCopy(perTypeId).then(function(model) {
            $scope.model = model;
            $scope.messages = PerTypeService.messageFlag;
            if (!_.isEmpty($scope.messages)) {
                $scope.hasMessage = true;
                PerTypeService.messageFlag = {};
            }
            $scope.loading = false;
        });



        $scope.validateOptions = {
            rules: {
                name: {
                    required: true,
                    unique: 'person_type,name,' + perTypeId
                }
            },
            messages: {
                name: {
                    required: "Campo requerido",
                    unique: 'El Tipo de Persona ya fue tomada'
                }
            }

        };

        $scope.save = function(form, returnIndex) {
            $scope.messages = {};
            if (form.validate()) {
                $scope.saving = true;
                $scope.model.key = perTypeId;
                $scope.model.$update(perTypeId, function(data) {
                    $scope.saving = false;
                    $scope.hasMessage = true;
                    apiResource.resource('pertypes').setOnCache(data);
                    PerTypeService.messageFlag.title = "Tipo de Persona " + $scope.model.name + " Actualizada correctamente";
                    PerTypeService.messageFlag.type = "info";
                    $scope.messages = PerTypeService.messageFlag;
                    if (returnIndex) {
                        $state.go('root.pertypes');
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