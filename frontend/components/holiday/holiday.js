/**
 ** Holiday controller
 **/
define(['app'], function(app) {

    app.register.service('HolidayService', function() {

        var _this = this;

        _this.messageFlag = {};

        _this.getyears = function() {
            return [
                2019,
                2020
            ]
        }
    })

    app.register.controller('HolidayIdxCtrl', ['$scope', 'apiResource', '$stateParams', 'DTOptionsBuilder', 'HolidayService', '$rootScope', '$state', function($scope, apiResource, $stateParams, DTOptionsBuilder, HolidayService, $rootScope, $state) {

        $scope.holidays = [];
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

        apiResource.resource('holidays').query().then(function(results) {
            $scope.loading = false;
            $scope.holidays = results;
            $scope.messages = HolidayService.messageFlag;
            if (!_.isEmpty($scope.messages)) {
                $scope.hasMessage = true;
                HolidayService.messageFlag = {};
            }
        });

        $scope.delete = function(id) {
            apiResource.resource('holidays').getCopy(id).then(function(object) {
                var params = {
                    title: 'Atención',
                    text: 'Desea eliminar el Feriado ' + object.description + '.?'
                }
                $rootScope.openDeleteModal(params).then(function() {
                    var idx = _.findIndex($scope.holidays, function(el) {
                        return el.id == object.id;
                    });
                    if (idx > -1) {
                        $scope.holidays[idx].$deleting = true;
                        object.$delete(function() {
                            HolidayService.messageFlag.title = "Feriado eliminado correctamente";
                            HolidayService.messageFlag.type = "info";
                            $scope.messages = HolidayService.messageFlag;
                            $scope.hasMessage = true;
                            $scope.holidays[idx].$deleting = false;
                            $scope.holidays.splice(idx, 1);
                            apiResource.resource('holidays').removeFromCache(id);
                        })
                    }
                })
            });
        };

        $scope.goToCreate = function() {
            $state.go('root.holiday.create');
        }

    }]);

    app.register.controller('HolidayCreateCtrl', ['$scope', 'apiResource', '$stateParams', '$state', 'HolidayService', function($scope, apiResource, $stateParams, $state, HolidayService) {

        $scope.saving = false;
        $scope.isEdit = false;
        $scope.model = {};
        $scope.listPermissions = [];
        $scope.messages = [];
        $scope.years = HolidayService.getyears()

        $scope.model = apiResource.resource('holidays').create({
            date: new Date(),
            year: (new Date()).getFullYear()
        });

        // $scope.validateOptions = {
        //     rules: {
        //         name: {
        //             required: true,
        //             unique: 'holiday,name'
        //         },
        //         order: {
        //             required: true,

        //         }
        //     },
        //     messages: {
        //         name: {
        //             required: "Campo requerido",
        //             unique: 'El Feriado ya fue tomado'
        //         },
        //         order: {
        //             required: "El orden es requerido",

        //         }
        //     }

        // };

        $scope.save = function(form, returnIndex) {
            $scope.existError = false;
            $scope.messages = {};
            if (form.validate()) {
                $scope.saving = true;
                $scope.model.$save(function(data) {
                    apiResource.resource('holidays').setOnCache(data);
                    HolidayService.messageFlag.title = "Feriado creado correctamente";
                    HolidayService.messageFlag.type = "info";
                    if (returnIndex) {
                        $state.go('root.holiday');
                    } else {
                        $state.go('root.holiday.edit', {
                            holidayId: data.id
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
            $state.go('root.holiday')
        }

    }]);

    app.register.controller('HolidayEditCtrl', ['$scope', 'apiResource', '$stateParams', '$state', 'HolidayService', function($scope, apiResource, $stateParams, $state, HolidayService) {

        var holidayId = $stateParams.holidayId;


        $scope.loading = true;
        $scope.model = {};
        $scope.messages = {};
        $scope.existError = false;
        $scope.isEdit = true;
        $scope.years = HolidayService.getyears()

        apiResource.resource('holidays').getCopy(holidayId).then(function(model) {
            $scope.model = model;
            $scope.model.date = new Date($scope.model.date);
            $scope.model.year = (new Date()).getFullYear();
            $scope.messages = HolidayService.messageFlag;
            if (!_.isEmpty($scope.messages)) {
                $scope.hasMessage = true;
                HolidayService.messageFlag = {};
            }
            $scope.loading = false;
        });

        // $scope.validateOptions = {
        //     rules: {
        //         description: {
        //             required: true,
        //             unique: 'holiday,description,' + holidayId
        //         },
        //         order: {
        //             required: true,

        //         }
        //     },
        //     messages: {
        //         name: {
        //             required: "Campo requerido",
        //             unique: 'El Feriado ya fue tomado'
        //         },
        //         order: {
        //             required: "El orden es requerido",

        //         }
        //     }

        // };

        $scope.save = function(form, returnIndex) {
            $scope.messages = {};
            if (form.validate()) {
                $scope.saving = true;
                $scope.model.key = holidayId;
                $scope.model.$update(holidayId, function(data) {
                    $scope.saving = false;
                    $scope.hasMessage = true;
                    apiResource.resource('holidays').setOnCache(data);
                    HolidayService.messageFlag.title = "Feriado " + $scope.model.description + " Actualizado correctamente";
                    HolidayService.messageFlag.type = "info";
                    $scope.messages = HolidayService.messageFlag;
                    if (returnIndex) {
                        $state.go('root.holiday');
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
            $state.go('root.holiday')
        }

    }]);


});