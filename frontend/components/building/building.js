/**
 ** Building controller
 **/
define(['app'], function(app) {

    app.register.service('BuildingService', ['$filter', function($filter) {

        var _this = this;

        _this.messageFlag = {};

        _this.formatSchedule = function(model, daysOfWeek) {
            var scheduleModel = model.schedule;

            angular.forEach(scheduleModel, function(el, idx) {
                el.start = new Date(el.start);
                el.end = new Date(el.end);

                let foundDay = _.findWhere(daysOfWeek, { idparameter: idx });
                if (foundDay) {
                    foundDay.$selected = true;
                    scheduleModel[idx].$selected = true;
                } else {
                    scheduleModel[idx].$selected = false;
                }

            });

            return scheduleModel;
        };


        _this.getDay = function(keyDay, daysOfWeek) {
            var foundDay = _.findWhere(daysOfWeek, { idparameter: keyDay });
            if (foundDay) {
                return $filter('capitalize')(foundDay.value, 'oneLetter');
            }

            return "-"
        }


        _this.getTherapiesFromDay = function(keyDay, getTherapiesFromDay) {
            var therapiesFromDay = [];
            var foundTherapy = _.findWhere(getTherapiesFromDay, { key_day: keyDay });

            if (foundTherapy) {
                therapiesFromDay.push(foundTherapy)
            }

            return therapiesFromDay;
        };

        _this.addBuildingTherapy = function(keyDay, model) {
            let buildTherapy = {
                id:0,
                key_day: keyDay,
                build_id: model.id,
                therapist_user_id: null,
                capacity: 0,
                availability: 0,
                schedule: {
                    start: $filter('date')(model.schedule[keyDay].start, 'HH:mm'),
                    end: $filter('date')(model.schedule[keyDay].end, 'HH:mm'),
                }
            }

            return buildTherapy;
        };


        _this.formatScheduleTherapies = function(therapiesModel) {
            therapiesModel.forEach(function(element, index) {
                element.schedule = element.schedule.start +'|'+element.schedule.end
            });

            return therapiesModel;
        }


    }])

    app.register.controller('BuildingIdxCtrl', ['$scope', 'apiResource', '$stateParams', 'DTOptionsBuilder', 'BuildingService', '$rootScope', '$state', function($scope, apiResource, $stateParams, DTOptionsBuilder, BuildingService, $rootScope, $state) {

        $scope.buildings = [];
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

        apiResource.resource('buildings').query().then(function(results) {
            $scope.loading = false;
            $scope.buildings = results;
            $scope.messages = BuildingService.messageFlag;
            if (!_.isEmpty($scope.messages)) {
                $scope.hasMessage = true;
                BuildingService.messageFlag = {};
            }
        });

        $scope.delete = function(id) {
            apiResource.resource('buildings').getCopy(id).then(function(object) {
                var params = {
                    title: 'Atención',
                    text: 'Desea eliminar el edificio ' + object.name + '.?'
                }
                $rootScope.openDeleteModal(params).then(function() {
                    var idx = _.findIndex($scope.buildings, function(el) {
                        return el.id == object.id;
                    });
                    if (idx > -1) {
                        $scope.buildings[idx].$deleting = true;
                        object.$delete(function() {
                            BuildingService.messageFlag.title = "Edificio eliminada correctamente";
                            BuildingService.messageFlag.type = "info";
                            $scope.messages = BuildingService.messageFlag;
                            $scope.hasMessage = true;
                            $scope.buildings[idx].$deleting = false;
                            $scope.buildings.splice(idx, 1);
                            apiResource.resource('buildings').removeFromCache(id);
                        })
                    }
                })
            });
        };

        $scope.goToCreate = function() {
            $state.go('root.building.create')
        }

        $scope.gotoAvailables = function() {
            $state.go('root.buildingtherapyavailable')
        }

    }]);

    app.register.controller('BuildingCreateCtrl', ['$scope', 'apiResource', '$stateParams', '$state', 'BuildingService', '$q', 'envService', '$filter', function($scope, apiResource, $stateParams, $state, BuildingService, $q, envService, $filter) {

        $scope.saving = false;
        $scope.loading = true;
        $scope.model = {};
        $scope.listPermissions = [];
        $scope.messages = [];
        $scope.provinces = [];

        $scope.daysWeek = [];


        var reqKeyParameter = {
            method: 'GET',
            url: envService.read('api') + 'load-parameter/WEEK_DAYS'
        };

        var deps = $q.all([
            apiResource.loadFromApi(reqKeyParameter).then(function(daysWeek) {
                $scope.daysWeek = daysWeek;
            })
        ])

        deps.then(function() {

            angular.forEach($scope.daysWeek, function(day) {
                day.$selected = false;
            })

            $scope.loading = false;
            $scope.model = apiResource.resource('buildings').create({ name: '', schedule: {} });
        })


        // $scope.validateOptions = {
        //     rules: {
        //         name: {
        //             required: true,
        //             // unique: 'building,name'
        //         },
        //         province_id: {
        //             required: true,
        //             valueNotEquals: '?',
        //         }
        //     },
        //     messages: {
        //         name: {
        //             required: "Campo requerido",
        //             // unique: 'La Edificio ya fue tomada'
        //         },
        //         province_id: {
        //             required: "Campo requerido",
        //             valueNotEquals: 'Campo requerido',
        //         }
        //     }

        // };

        $scope.save = function(form, returnIndex) {
            $scope.messages = {};
            angular.forEach($scope.model.schedule, function(item) {
                if (!item.$selected) { delete item }

            });

            if (form.validate()) {
                $scope.saving = true;
                $scope.model.$save(function(data) {
                    apiResource.resource('buildings').setOnCache(data);
                    BuildingService.messageFlag.title = "Edificio creado correctamente";
                    BuildingService.messageFlag.type = "info";
                    if (returnIndex) {
                        $state.go('root.building');
                    } else {
                        $state.go('root.building.edit', {
                            buildingId: data.id
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

        $scope.goToIndex = function() {
            $state.go('root.building')
        }

    }]);

    app.register.controller('BuildingEditCtrl', ['$scope', 'apiResource', '$stateParams', '$state', 'BuildingService', '$q', 'envService', function($scope, apiResource, $stateParams, $state, BuildingService, $q, envService) {

        var buildingId = $stateParams.buildingId;
        $scope.isEdit = true;
        $scope.daysWeek = [];
        $scope.therapies = [];
        $scope.therapists = [];


        var reqKeyParameter = {
            method: 'GET',
            url: envService.read('api') + 'load-parameter/WEEK_DAYS'
        };

        var deps = $q.all([
            apiResource.loadFromApi(reqKeyParameter).then(function(daysWeek) {
                $scope.daysWeek = daysWeek;
            }),
            apiResource.resource('therapies').queryCopy().then(function(therapies) {
                $scope.therapies = therapies;
            }),
            apiResource.resource('therapists').queryCopy().then(function(therapists) {
                $scope.therapists = therapists;
            })
        ])

        $scope.loading = true;
        $scope.model = {};
        $scope.messages = {};
        $scope.existError = false;

        deps.then(function() {
            apiResource.resource('buildings').get(buildingId).then(function(model) {
                $scope.model = model;
                console.log(model)
                $scope.messages = BuildingService.messageFlag;
                if (!_.isEmpty($scope.messages)) {
                    $scope.hasMessage = true;
                    BuildingService.messageFlag = {};
                }
                $scope.model.schedule = BuildingService.formatSchedule($scope.model, $scope.daysWeek);
                $scope.loading = false;


            });
        })


        $scope.getDay = function(keyDay) {
            return BuildingService.getDay(keyDay, $scope.daysWeek);
        }

        $scope.getTherapiesFromDay = function(keyDay, therapiesBuilding) {
            return BuildingService.getTherapiesFromDay(keyDay, therapiesBuilding);
        }

        $scope.addBuildingTherapy = function(keyDay) {
            let buildTherapy = BuildingService.addBuildingTherapy(keyDay, $scope.model);
            $scope.model.therapies.push(buildTherapy)
        }

        $scope.deleteTherapy = function(key) {
            $scope.model.therapies.splice(key, 1);
        }

        $scope.save = function(form, returnIndex) {
            $scope.messages = {};
            if (form.validate()) {
                angular.forEach($scope.model.schedule, function(item,idex) {
                    if (!item.$selected) { 
                       delete $scope.model.schedule[idex]
                    }
                });
                //hack
                $scope.model.therapies = BuildingService.formatScheduleTherapies($scope.model.therapies);

                $scope.saving = true;
                $scope.model.key = buildingId;
                $scope.model.$update(buildingId, function(dataModel) {
                    $scope.saving = false;
                    $scope.hasMessage = true;
                    apiResource.resource('buildings').setOnCache(dataModel);
                    BuildingService.messageFlag.title = "Edificio " + $scope.model.name + " Actualizado correctamente";
                    BuildingService.messageFlag.type = "info";
                    $scope.messages = BuildingService.messageFlag;
                    if (returnIndex) {
                        $state.go('root.building');
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
            $state.go('root.building')
        }

    }]);


});