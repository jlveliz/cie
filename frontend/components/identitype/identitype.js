/**
 ** Identification type controller
 **/
define(['app'], function(app) {

    app.register.service('IdenTypeService', function() {

        var _this = this;

        _this.messageFlag = {};
    })

    app.register.controller('IdenTypeIdxCtrl', ['$scope', 'apiResource', '$stateParams', 'DTOptionsBuilder', 'IdenTypeService', '$rootScope', function($scope, apiResource, $stateParams, DTOptionsBuilder, IdenTypeService, $rootScope) {

        $scope.identiTypes = [];
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

        apiResource.resource('identitypes').query().then(function(results) {
            $scope.loading = false;
            $scope.identiTypes = results;
            $scope.messages = IdenTypeService.messageFlag;
            if (!_.isEmpty($scope.messages)) {
                $scope.hasMessage = true;
                IdenTypeService.messageFlag = {};
            }
        });

        $scope.delete = function(id) {
            apiResource.resource('identitypes').getCopy(id).then(function(object) {
                var params = {
                    title: 'Atención',
                    text: 'Desea eliminar el tipo de identificación ' + object.name + '.?'
                }
                $rootScope.openDeleteModal(params).then(function() {
                    var idx = _.findIndex($scope.identiTypes, function(el) {
                        return el.id == object.id;
                    });
                    if (idx > -1) {
                        $scope.identiTypes[idx].$deleting = true;
                        object.$delete(function() {
                            IdenTypeService.messageFlag.title = "Tipo de identificación eliminada correctamente";
                            IdenTypeService.messageFlag.type = "info";
                            $scope.messages = IdenTypeService.messageFlag;
                            $scope.hasMessage = true;
                            $scope.identiTypes[idx].$deleting = false;
                            $scope.identiTypes.splice(idx, 1);
                            apiResource.resource('identiTypes').removeFromCache(id);
                        })
                    }
                })
            });
        }
    }]);

    app.register.controller('IdenTypeCreateCtrl', ['$scope', 'apiResource', '$stateParams', '$state', 'IdenTypeService', '$q', function($scope, apiResource, $stateParams, $state, IdenTypeService, $q) {

        $scope.saving = false;
        $scope.loading = true;
        $scope.model = {};
        $scope.messages = [];
        $scope.provinces = [];

        $scope.loading = false;
        $scope.model = apiResource.resource('identitypes').create();



        $scope.validateOptions = {
            rules: {
                name: {
                    required: true,
                    unique: 'identification_type,name'
                },
            },
            messages: {
                name: {
                    required: "Campo requerido",
                    unique: 'El tipo de identificación ya fué tomado'
                },
            }

        };

        $scope.save = function(form, returnIndex) {
            $scope.messages = {};
            if (form.validate()) {
                $scope.saving = true;
                $scope.model.$save(function(data) {
                    apiResource.resource('identitypes').setOnCache(data);
                    IdenTypeService.messageFlag.title = "El Tipo de identificación fué creada correctamente";
                    IdenTypeService.messageFlag.type = "info";
                    if (returnIndex) {
                        $state.go('root.identitypes');
                    } else {
                        $state.go('root.identitypes.edit', {
                            idenTypeId: data.id
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

    app.register.controller('IdenTypeEditCtrl', ['$scope', 'apiResource', '$stateParams', '$state', 'IdenTypeService', '$q', function($scope, apiResource, $stateParams, $state, IdenTypeService, $q) {

        var idenTypeId = $stateParams.idenTypeId;
        $scope.isEdit = true;
        $scope.loading = true;
        $scope.model = {};
        $scope.messages = {};
        $scope.existError = false;


        apiResource.resource('identitypes').getCopy(idenTypeId).then(function(model) {
            $scope.model = model;
            $scope.messages = IdenTypeService.messageFlag;
            if (!_.isEmpty($scope.messages)) {
                $scope.hasMessage = true;
                IdenTypeService.messageFlag = {};
            }
            $scope.loading = false;
        });



        $scope.validateOptions = {
            rules: {
                name: {
                    required: true,
                    unique: 'person_type,name,' + idenTypeId
                }
            },
            messages: {
                name: {
                    required: "Campo requerido",
                    unique: 'El Tipo de identificación ya fué tomado'
                }
            }

        };

        $scope.save = function(form, returnIndex) {
            $scope.messages = {};
            if (form.validate()) {
                $scope.saving = true;
                $scope.model.key = idenTypeId;
                $scope.model.$update(idenTypeId, function(data) {
                    $scope.saving = false;
                    $scope.hasMessage = true;
                    apiResource.resource('identitypes').setOnCache(data);
                    IdenTypeService.messageFlag.title = "Tipo de identificación " + $scope.model.name + " Actualizada correctamente";
                    IdenTypeService.messageFlag.type = "info";
                    $scope.messages = IdenTypeService.messageFlag;
                    if (returnIndex) {
                        $state.go('root.identitypes');
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