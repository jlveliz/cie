/**
 ** Parish controller
 **/
define(['app'], function(app) {

    app.register.service('ParishService', function() {

        var _this = this;

        _this.messageFlag = {};
    })

    app.register.controller('ParishIdxCtrl', ['$scope', 'apiResource', '$stateParams', 'DTOptionsBuilder', 'ParishService', '$rootScope', '$state', function($scope, apiResource, $stateParams, DTOptionsBuilder, ParishService, $rootScope, $state) {

        $scope.parishies = [];
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

        apiResource.resource('parishies').query().then(function(results) {
            $scope.loading = false;
            $scope.parishies = results;
            $scope.messages = ParishService.messageFlag;
            if (!_.isEmpty($scope.messages)) {
                $scope.hasMessage = true;
                ParishService.messageFlag = {};
            }
        });

        $scope.delete = function(id) {
            apiResource.resource('parishies').getCopy(id).then(function(object) {
                var params = {
                    title: 'Atención',
                    text: 'Desea eliminar la Parroquia ' + object.name + '.?'
                }
                $rootScope.openDeleteModal(params).then(function() {
                    var idx = _.findIndex($scope.parishies, function(el) {
                        return el.id == object.id;
                    });
                    if (idx > -1) {
                        $scope.parishies[idx].$deleting = true;
                        object.$delete(function() {
                            ParishService.messageFlag.title = "Parroquia eliminada correctamente";
                            ParishService.messageFlag.type = "info";
                            $scope.messages = ParishService.messageFlag;
                            $scope.hasMessage = true;
                            $scope.parishies[idx].$deleting = false;
                            $scope.parishies.splice(idx, 1);
                            apiResource.resource('parishies').removeFromCache(id);
                        })
                    }
                })
            });
        };

        $scope.goToCreate = function() {
            $state.go('root.parish.create')
        }

    }]);

    app.register.controller('ParishCreateCtrl', ['$scope', 'apiResource', '$stateParams', '$state', 'ParishService', '$q', function($scope, apiResource, $stateParams, $state, ParishService, $q) {

        $scope.saving = false;
        $scope.loading = true;
        $scope.model = {};
        $scope.listPermissions = [];
        $scope.messages = [];
        $scope.cities = [];

        var deps = $q.all([
            apiResource.resource('cities').query().then(function(cities) {
                $scope.cities = cities
            })
        ])

        deps.then(function() {
            $scope.loading = false;
            $scope.model = apiResource.resource('parishies').create();
        })


        $scope.validateOptions = {
            rules: {
                name: {
                    required: true,
                    // unique: 'parish,name'
                },
                parish_id: {
                    required: true,
                    valueNotEquals: '?',
                }
            },
            messages: {
                name: {
                    required: "Campo requerido",
                    // unique: 'La Parroquia ya fue tomada'
                },
                parish_id: {
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
                    apiResource.resource('parishies').setOnCache(data);
                    ParishService.messageFlag.title = "Parroquia creada correctamente";
                    ParishService.messageFlag.type = "info";
                    if (returnIndex) {
                        $state.go('root.parish');
                    } else {
                        $state.go('root.parish.edit', {
                            parishId: data.id
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
        };

        $scope.goToIndex = function() {
            $state.go('root.parish')
        }

    }]);

    app.register.controller('ParishEditCtrl', ['$scope', 'apiResource', '$stateParams', '$state', 'ParishService', '$q', function($scope, apiResource, $stateParams, $state, ParishService, $q) {

        var parishId = $stateParams.parishId;
        $scope.isEdit = true;
        $scope.cities = [];

        var deps = $q.all([
            apiResource.resource('cities').query().then(function(cities) {
                $scope.cities = cities
            })
        ])

        $scope.loading = true;
        $scope.model = {};
        $scope.messages = {};
        $scope.existError = false;

        deps.then(function() {
            apiResource.resource('parishies').getCopy(parishId).then(function(model) {
                $scope.model = model;
                $scope.messages = ParishService.messageFlag;
                if (!_.isEmpty($scope.messages)) {
                    $scope.hasMessage = true;
                    ParishService.messageFlag = {};
                }
                $scope.loading = false;
            });
        })


        $scope.validateOptions = {
            rules: {
                name: {
                    required: true,
                },
                province_id: {
                    required: true,
                    valueNotEquals: '?',
                }
            },
            messages: {
                name: {
                    required: "Campo requerido",
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
                $scope.model.key = parishId;
                $scope.model.$update(parishId, function(data) {
                    $scope.saving = false;
                    $scope.hasMessage = true;
                    apiResource.resource('parishies').setOnCache(data);
                    ParishService.messageFlag.title = "Parroquia " + $scope.model.name + " Actualizada correctamente";
                    ParishService.messageFlag.type = "info";
                    $scope.messages = ParishService.messageFlag;
                    if (returnIndex) {
                        $state.go('root.parish');
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
            $state.go('root.parish')
        }

    }]);


});