/**
 ** Province controller
 **/
define(['app'], function(app) {

    app.register.service('ProvinceService', function() {

        var _this = this;

        _this.messageFlag = {};
    })

    app.register.controller('ProvinceIdxCtrl', ['$scope', 'apiResource', '$stateParams', 'DTOptionsBuilder', 'ProvinceService', '$rootScope', function($scope, apiResource, $stateParams, DTOptionsBuilder, ProvinceService, $rootScope) {

        $scope.provinces = [];
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

        apiResource.resource('provinces').query().then(function(results) {
            $scope.loading = false;
            $scope.provinces = results;
            $scope.messages = ProvinceService.messageFlag;
            if (!_.isEmpty($scope.messages)) {
                $scope.hasMessage = true;
                ProvinceService.messageFlag = {};
            }
        });

        $scope.delete = function(id) {
            apiResource.resource('provinces').getCopy(id).then(function(object) {
                var params = {
                    title: 'Atención',
                    text: 'Desea eliminar la Provincia ' + object.name + '.?'
                }
                $rootScope.openDelteModal(params).then(function() {
                    var idx = _.findIndex($scope.provinces, function(el) {
                        return el.id == object.id;
                    });
                    if (idx > -1) {
                        $scope.provinces[idx].$deleting = true;
                        object.$delete(function() {
                            ProvinceService.messageFlag.title = "Provincia eliminado correctamente";
                            ProvinceService.messageFlag.type = "info";
                            $scope.messages = ProvinceService.messageFlag;
                            $scope.hasMessage = true;
                            $scope.provinces[idx].$deleting = false;
                            $scope.provinces.splice(idx, 1);
                            apiResource.resource('provinces').removeFromCache(id);
                        })
                    }
                })
            });
        }

    }]);

    app.register.controller('ProvinceCreateCtrl', ['$scope', 'apiResource', '$stateParams', '$state', 'ProvinceService', function($scope, apiResource, $stateParams, $state, ProvinceService) {

        $scope.saving = false;
        $scope.model = {};
        $scope.listPermissions = [];
        $scope.messages = [];


        $scope.model = apiResource.resource('provinces').create();

        $scope.validateOptions = {
            rules: {
                name: {
                    required: true,
                    unique: 'province,name'
                }
            },
            messages: {
                name: {
                    required: "Campo requerido",
                    unique: 'La Provincia ya fue tomada'
                }
            }

        };

        $scope.save = function(form, returnIndex) {
            $scope.messages = {};
            if (form.validate()) {
                $scope.saving = true;
                $scope.model.$save(function(data) {
                    apiResource.resource('provinces').setOnCache(data);
                    ProvinceService.messageFlag.title = "Provincia creada correctamente";
                    ProvinceService.messageFlag.type = "info";
                    if (returnIndex) {
                        $state.go('root.province');
                    } else {
                        $state.go('root.province.edit', {
                            provinceId: data.id
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

    app.register.controller('ProvinceEditCtrl', ['$scope', 'apiResource', '$stateParams', '$state', 'ProvinceService', function($scope, apiResource, $stateParams, $state, ProvinceService) {

        var provinceId = $stateParams.provinceId;
        $scope.isEdit = true;


        $scope.loading = true;
        $scope.model = {};
        $scope.messages = {};
        $scope.existError = false;

        apiResource.resource('provinces').getCopy(provinceId).then(function(model) {
            $scope.model = model;
            $scope.messages = ProvinceService.messageFlag;
            if (!_.isEmpty($scope.messages)) {
                $scope.hasMessage = true;
                ProvinceService.messageFlag = {};
            }
            $scope.loading = false;
        });

        $scope.validateOptions = {
            rules: {
                name: {
                    required: true,
                    unique: 'province,name,' + provinceId
                }
            },
            messages: {
                name: {
                    required: "Campo requerido",
                    unique: 'El Provincia ya fue tomado'
                }
            }

        };

        $scope.save = function(form, returnIndex) {
            $scope.messages = {};
            if (form.validate()) {
                $scope.saving = true;
                $scope.model.key = provinceId;
                $scope.model.$update(provinceId, function(data) {
                    $scope.saving = false;
                    $scope.hasMessage = true;
                    apiResource.resource('provinces').setOnCache(data);
                    ProvinceService.messageFlag.title = "Provincia " + $scope.model.name + " Actualizada correctamente";
                    ProvinceService.messageFlag.type = "info";
                    $scope.messages = ProvinceService.messageFlag;
                    if (returnIndex) {
                        $state.go('root.province');
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