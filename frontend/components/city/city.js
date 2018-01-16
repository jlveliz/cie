/**
 ** City controller
 **/
define(['app'], function(app) {

    app.register.service('CityService', function() {

        var _this = this;

        _this.messageFlag = {};
    })

    app.register.controller('CityIdxCtrl', ['$scope', 'apiResource', '$stateParams', 'DTOptionsBuilder', 'CityService', '$rootScope', function($scope, apiResource, $stateParams, DTOptionsBuilder, CityService, $rootScope) {

        $scope.cities = [];
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

        apiResource.resource('cities').query().then(function(results) {
            $scope.loading = false;
            $scope.cities = results;
            $scope.messages = CityService.messageFlag;
            if (!_.isEmpty($scope.messages)) {
                $scope.hasMessage = true;
                CityService.messageFlag = {};
            }
        });

        $scope.delete = function(id) {
            apiResource.resource('cities').getCopy(id).then(function(object) {
                var params = {
                    title: 'Atención',
                    text: 'Desea eliminar la Ciudad ' + object.name + '.?'
                }
                $rootScope.openDelteModal(params).then(function() {
                    var idx = _.findIndex($scope.cities, function(el) {
                        return el.id == object.id;
                    });
                    if (idx > -1) {
                        $scope.cities[idx].$deleting = true;
                        object.$delete(function() {
                            CityService.messageFlag.title = "Ciudad eliminada correctamente";
                            CityService.messageFlag.type = "info";
                            $scope.messages = CityService.messageFlag;
                            $scope.hasMessage = true;
                            $scope.cities[idx].$deleting = false;
                            $scope.cities.splice(idx, 1);
                            apiResource.resource('cities').removeFromCache(id);
                        })
                    }
                })
            });
        }

    }]);

    app.register.controller('CityCreateCtrl', ['$scope', 'apiResource', '$stateParams', '$state', 'CityService', '$q', function($scope, apiResource, $stateParams, $state, CityService, $q) {

        $scope.saving = false;
        $scope.loading = true;
        $scope.model = {};
        $scope.listPermissions = [];
        $scope.messages = [];
        $scope.provinces = [];

        var deps = $q.all([
            apiResource.resource('provinces').query().then(function(provinces) {
                $scope.provinces = provinces
            })
        ])

        deps.then(function() {
            $scope.loading = false;
            $scope.model = apiResource.resource('cities').create();
        })


        $scope.validateOptions = {
            rules: {
                name: {
                    required: true,
                    // unique: 'city,name'
                },
                province_id: {
                    required: true,
                    valueNotEquals: '?',
                }
            },
            messages: {
                name: {
                    required: "Campo requerido",
                    // unique: 'La Ciudad ya fue tomada'
                },
                province_id: {
                    required: "Campo requerido",
                    valueNotEquals: 'Campo requerido',
                }
            }

        };

        $scope.save = function(form, returnIndex) {
            $scope.messages = {};
            if (form.validate()) {
                $scope.saving = true;
                $scope.model.$save(function(data) {
                    apiResource.resource('cities').setOnCache(data);
                    CityService.messageFlag.title = "Ciudad creada correctamente";
                    CityService.messageFlag.type = "info";
                    if (returnIndex) {
                        $state.go('root.city');
                    } else {
                        $state.go('root.city.edit', {
                            cityId: data.id
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

    app.register.controller('CityEditCtrl', ['$scope', 'apiResource', '$stateParams', '$state', 'CityService', '$q', function($scope, apiResource, $stateParams, $state, CityService, $q) {

        var cityId = $stateParams.cityId;
        $scope.isEdit = true;
        $scope.provinces = [];

        var deps = $q.all([
            apiResource.resource('provinces').query().then(function(provinces) {
                $scope.provinces = provinces
            })
        ])

        $scope.loading = true;
        $scope.model = {};
        $scope.messages = {};
        $scope.existError = false;

        deps.then(function() {
            apiResource.resource('cities').getCopy(cityId).then(function(model) {
                $scope.model = model;
                $scope.messages = CityService.messageFlag;
                if (!_.isEmpty($scope.messages)) {
                    $scope.hasMessage = true;
                    CityService.messageFlag = {};
                }
                $scope.loading = false;
            });
        })


        $scope.validateOptions = {
            rules: {
                name: {
                    required: true,
                    // unique: 'city,name,' + cityId
                },
                province_id: {
                    required: true,
                    valueNotEquals: '?',
                }
            },
            messages: {
                name: {
                    required: "Campo requerido",
                    // unique: 'la Ciudad ya fue tomada'
                },
                province_id: {
                    required: "Campo requerido",
                    valueNotEquals: 'Campo requerido',
                }
            }

        };

        $scope.save = function(form, returnIndex) {
            $scope.messages = {};
            if (form.validate()) {
                $scope.saving = true;
                $scope.model.key = cityId;
                $scope.model.$update(cityId, function(data) {
                    $scope.saving = false;
                    $scope.hasMessage = true;
                    apiResource.resource('cities').setOnCache(data);
                    CityService.messageFlag.title = "Ciudad " + $scope.model.name + " Actualizada correctamente";
                    CityService.messageFlag.type = "info";
                    $scope.messages = CityService.messageFlag;
                    if (returnIndex) {
                        $state.go('root.city');
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