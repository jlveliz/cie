/**
 ** Carousel controller
 **/
define(['app'], function(app) {

    app.register.service('CarouselService', function() {

        var _this = this;

        _this.messageFlag = {};
    })

    app.register.controller('CarouselIdxCtrl', ['$scope', 'apiResource', '$stateParams', 'DTOptionsBuilder', 'CarouselService', '$rootScope', '$state',function($scope, apiResource, $stateParams, DTOptionsBuilder, CarouselService, $rootScope, $state) {

        $scope.carousels = [];
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

        apiResource.resource('carousels').query().then(function(results) {
            $scope.loading = false;
            $scope.carousels = results;
            $scope.messages = CarouselService.messageFlag;
            if (!_.isEmpty($scope.messages)) {
                $scope.hasMessage = true;
                CarouselService.messageFlag = {};
            }
        });

        $scope.delete = function(id) {
            apiResource.resource('carousels').getCopy(id).then(function(object) {
                var params = {
                    title: 'Atención',
                    text: 'Desea eliminar la Provincia ' + object.name + '.?'
                }
                $rootScope.openDeleteModal(params).then(function() {
                    var idx = _.findIndex($scope.carousels, function(el) {
                        return el.id == object.id;
                    });
                    if (idx > -1) {
                        $scope.carousels[idx].$deleting = true;
                        object.$delete(function() {
                            CarouselService.messageFlag.title = "Provincia eliminado correctamente";
                            CarouselService.messageFlag.type = "info";
                            $scope.messages = CarouselService.messageFlag;
                            $scope.hasMessage = true;
                            $scope.carousels[idx].$deleting = false;
                            $scope.carousels.splice(idx, 1);
                            apiResource.resource('carousels').removeFromCache(id);
                        })
                    }
                })
            });
        };

        $scope.goToCreate = function() {
            $state.go('root.carousel.create');
        }

    }]);

    app.register.controller('CarouselCreateCtrl', ['$scope', 'apiResource', '$stateParams', '$state', 'CarouselService', function($scope, apiResource, $stateParams, $state, CarouselService) {

        $scope.saving = false;
        $scope.model = {};
        $scope.messages = [];


        $scope.model = apiResource.resource('carousels').create();

        $scope.validateOptions = {
            rules: {
                name: {
                    required: true,
                    unique: 'carousel,name'
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
                    apiResource.resource('carousels').setOnCache(data);
                    CarouselService.messageFlag.title = "Provincia creada correctamente";
                    CarouselService.messageFlag.type = "info";
                    if (returnIndex) {
                        $state.go('root.carousel');
                    } else {
                        $state.go('root.carousel.edit', {
                            carouselId: data.id
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
            $state.go('root.carousel');
        }

    }]);

    app.register.controller('CarouselEditCtrl', ['$scope', 'apiResource', '$stateParams', '$state', 'CarouselService', function($scope, apiResource, $stateParams, $state, CarouselService) {

        var carouselId = $stateParams.carouselId;
        $scope.isEdit = true;


        $scope.loading = true;
        $scope.model = {};
        $scope.messages = {};
        $scope.existError = false;

        apiResource.resource('carousels').getCopy(carouselId).then(function(model) {
            $scope.model = model;
            $scope.messages = CarouselService.messageFlag;
            if (!_.isEmpty($scope.messages)) {
                $scope.hasMessage = true;
                CarouselService.messageFlag = {};
            }
            $scope.loading = false;
        });

        $scope.validateOptions = {
            rules: {
                name: {
                    required: true,
                    unique: 'carousel,name,' + carouselId
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
                $scope.model.key = carouselId;
                $scope.model.$update(carouselId, function(data) {
                    $scope.saving = false;
                    $scope.hasMessage = true;
                    apiResource.resource('carousels').setOnCache(data);
                    CarouselService.messageFlag.title = "Provincia " + $scope.model.name + " Actualizada correctamente";
                    CarouselService.messageFlag.type = "info";
                    $scope.messages = CarouselService.messageFlag;
                    if (returnIndex) {
                        $state.go('root.carousel');
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
            $state.go('root.carousel');
        }

    }]);


});