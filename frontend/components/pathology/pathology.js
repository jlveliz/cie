/**
 ** Pathology controller
 **/
define(['app'], function(app) {

    app.register.service('PathologyService', function() {

        var _this = this;

        _this.messageFlag = {};
    })

    app.register.controller('PathologyIdxCtrl', ['$scope', 'apiResource', '$stateParams', 'DTOptionsBuilder', 'PathologyService', '$rootScope', function($scope, apiResource, $stateParams, DTOptionsBuilder, PathologyService, $rootScope) {

        $scope.pathologies = [];
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

        apiResource.resource('pathologies').query().then(function(results) {
            $scope.loading = false;
            $scope.pathologies = results;
            $scope.messages = PathologyService.messageFlag;
            if (!_.isEmpty($scope.messages)) {
                $scope.hasMessage = true;
                PathologyService.messageFlag = {};
            }
        });

        $scope.delete = function(id) {
            apiResource.resource('pathologies').getCopy(id).then(function(object) {
                var params = {
                    title: 'Atención',
                    text: 'Desea eliminar la Patología ' + object.name + '.?'
                }
                $rootScope.openDelteModal(params).then(function() {
                    var idx = _.findIndex($scope.pathologies, function(el) {
                        return el.id == object.id;
                    });
                    if (idx > -1) {
                        $scope.pathologies[idx].$deleting = true;
                        object.$delete(function() {
                            PathologyService.messageFlag.title = "Patología eliminada correctamente";
                            PathologyService.messageFlag.type = "info";
                            $scope.messages = PathologyService.messageFlag;
                            $scope.hasMessage = true;
                            $scope.pathologies[idx].$deleting = false;
                            $scope.pathologies.splice(idx, 1);
                            apiResource.resource('pathologies').removeFromCache(id);
                        })
                    }
                })
            });
        }

    }]);

    app.register.controller('PathologyCreateCtrl', ['$scope', 'apiResource', '$stateParams', '$state', 'PathologyService', '$q', function($scope, apiResource, $stateParams, $state, PathologyService, $q) {

        $scope.saving = false;
        $scope.model = {};
        $scope.listPermissions = [];
        $scope.messages = [];
        $scope.cities = [];


        $scope.model = apiResource.resource('pathologies').create();



        $scope.validateOptions = {
            rules: {
                name: {
                    required: true,
                    unique: 'pathology,name'
                }
            },
            messages: {
                name: {
                    required: "Campo requerido",
                    unique: 'La Patología ya fue tomada'
                }
            }

        };

        $scope.save = function(form, returnIndex) {
            $scope.messages = {};
            if (form.validate()) {
                $scope.saving = true;
                $scope.model.$save(function(data) {
                    apiResource.resource('pathologies').setOnCache(data);
                    PathologyService.messageFlag.title = "Patología creada correctamente";
                    PathologyService.messageFlag.type = "info";
                    if (returnIndex) {
                        $state.go('root.pathology');
                    } else {
                        $state.go('root.pathology.edit', {
                            pathologyId: data.id
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

    app.register.controller('PathologyEditCtrl', ['$scope', 'apiResource', '$stateParams', '$state', 'PathologyService', '$q', function($scope, apiResource, $stateParams, $state, PathologyService, $q) {

        var pathologyId = $stateParams.pathologyId;
        $scope.isEdit = true;
        $scope.loading = true;
        $scope.model = {};
        $scope.messages = {};
        $scope.existError = false;


        apiResource.resource('pathologies').getCopy(pathologyId).then(function(model) {
            $scope.model = model;
            $scope.messages = PathologyService.messageFlag;
            if (!_.isEmpty($scope.messages)) {
                $scope.hasMessage = true;
                PathologyService.messageFlag = {};
            }
            $scope.loading = false;
        });



        $scope.validateOptions = {
            rules: {
                name: {
                    required: true,
                    unique: 'pathology,name,' + pathologyId
                }
            },
            messages: {
                name: {
                    required: "Campo requerido",
                    unique: "La Patología es requerida",
                }
            }

        };

        $scope.save = function(form, returnIndex) {
            $scope.messages = {};
            if (form.validate()) {
                $scope.saving = true;
                $scope.model.key = pathologyId;
                $scope.model.$update(pathologyId, function(data) {
                    $scope.saving = false;
                    $scope.hasMessage = true;
                    apiResource.resource('pathologies').setOnCache(data);
                    PathologyService.messageFlag.title = "Patología " + $scope.model.name + " Actualizada correctamente";
                    PathologyService.messageFlag.type = "info";
                    $scope.messages = PathologyService.messageFlag;
                    if (returnIndex) {
                        $state.go('root.pathology');
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