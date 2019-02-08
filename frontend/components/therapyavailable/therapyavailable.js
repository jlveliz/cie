/**
 ** Therapy available controller
 **/
define(['app'], function(app) {


    app.register.service('TherapyAvailableService', ['apiResource', '$filter', '$q', function(apiResource, $filter, $q) {
        var _this = this;

        _this.messageFlag = {};

        _this.filterTherapies = function(queryBuilding, buildingsCollections, therapiesCollection) {
            if (!queryBuilding) return false;

            var building = _.findWhere(buildingsCollections, { id: queryBuilding });

            if (building) {
                angular.forEach(therapiesCollection, function(therapy) {
                    therapy.$visible = false;

                    let founded = _.findWhere(building.therapies, { therapy_id: therapy.id })
                    if (founded) {
                        therapy.$visible = true;
                    }
                });

                return therapiesCollection;
            }


            return false;
        }

        _this.filterTerapists = function(query, buildingsCollections, therapistsArray) {

            if (!query.building || !query.therapy_id) return false;

            var building = _.findWhere(buildingsCollections, { id: query.building });

            if (building) {
                angular.forEach(therapistsArray, function(therapist) {
                    therapist.$visible = false;
                    let founded = _.find(building.therapies, function(therapyBuilding) {
                        return therapyBuilding.therapist_user_id == therapist.id && therapyBuilding.therapy_id == query.therapy_id
                    })
                    if (founded) {
                        therapist.$visible = true;
                    }
                });
                return therapistsArray;
            }


            return false;
        }

        _this.getDays = function(query, buildingsCollections) {

            if (!query.building || !query.therapy_id || !query.therapist_id) return false;

            var building = _.findWhere(buildingsCollections, { id: query.building });

            if (building) {
                var daysReturn = [];

                let filter = _.filter(building.therapies, function(therapyBuilding) {
                    return therapyBuilding.build_id == query.building && therapyBuilding.therapy_id == query.therapy_id && therapyBuilding.therapist_user_id == query.therapist_id
                })
                if (filter) {
                    return filter;
                }

            }


            return false;
        }

        _this.getDay = function(keyDay, daysOfWeek) {
            let found = _.findWhere(daysOfWeek, { idparameter: keyDay });
            if (found) return $filter('capitalize')(found.value, 'oneLetter')
        };

        _this.getMaxAvailable = function(schedules, idSchedule) {
            var found = _.findWhere(schedules, { id: idSchedule });

            if (found)
                return found.capacity;

            return 0

        }


        _this.save = function(model) {

            var deferred = $q.defer();

            var successCallback = function(model) {
                deferred.resolve(model);
            }

            var failCallback = function(error) {
                deferred.reject(error);
            }

            if (model.id) {
                model.$update(model.id, successCallback, failCallback);
            } else {
                model.$save(successCallback, failCallback);
            }

            return deferred.promise;
        };


        _this.getTherapyId = function(queryBuilding, buildingTherapyid, buildings) {
            if (!queryBuilding) return false;

            var building = _.findWhere(buildings, { id: queryBuilding });

            if (building) {
                let found = _.findWhere(building.therapies, { id: buildingTherapyid });

                return found.therapy_id;
            }
        }

        _this.getTherapistId = function(queryBuilding, buildingTherapyid, buildings) {
            if (!queryBuilding) return false;

            var building = _.findWhere(buildings, { id: queryBuilding });

            if (building) {
                let found = _.findWhere(building.therapies, { id: buildingTherapyid });

                return found.therapist_user_id;
            }
        }


    }]);


    app.register.controller('TherapyAvailableIdxCtrl', ['$scope', 'apiResource', '$stateParams', 'DTOptionsBuilder', 'TherapyAvailableService', '$rootScope', '$state', '$q', 'envService', function($scope, apiResource, $stateParams, DTOptionsBuilder, TherapyAvailableService, $rootScope, $state, $q, envService) {

        $scope.loading = true;
        $scope.buildings = [];
        $scope.query = {

        };



        var deps = $q.all([
            apiResource.resource('buildings').query().then(function(buildings) {
                $scope.buildings = buildings;
                $scope.query.building = $scope.buildings[0].id;
            }),

            apiResource.resource('therapies').query().then(function(therapies) {
                $scope.therapies = therapies;
            }),

            apiResource.resource('therapies').query().then(function(therapies) {
                $scope.therapies = therapies;
            }),


        ]);


        deps.then(function() {
            $scope.loadList();
            $scope.filterTherapies();
        });


        $scope.filterTherapies = function() {

            if ($scope.query.therapy_id) $scope.query.therapy_id = null;

            if ($scope.query.therapist_id) $scope.query.therapist_id = null;

            if ($scope.query.key_day) $scope.query.key_day = null;

            $scope.therapies = TherapyAvailableService.filterTherapies($scope.query.building, $scope.buildings, $scope.therapies);
        }

        $scope.loadList = function() {
            $scope.loading = true;

            let params = {
                building: $scope.query.building,
                nocache: true,
            }

            if ($scope.query.therapy) {
                params.therapyId = $scope.query.therapy;
            }

            apiResource.resource('buildingtherapyavailable').query(params).then(function(results) {
                angular.forEach(results, function(value, key) {
                    value.therapist_user_id = parseInt(value.therapist_user_id);
                    value.avalability = parseInt(value.avalability);
                });

                $scope.models = results;
                $scope.loading = false;
                $scope.inscriptions = results.data;
                $scope.totalItems = results.total;
                $scope.maxSize = 5;

                $scope.messages = TherapyAvailableService.messageFlag;
                if (!_.isEmpty($scope.messages)) {

                    $scope.hasMessage = true;
                    PUserInscriptionService.messageFlag = {};
                }
            });
        };

        $scope.gotoBuilding = function() {
            $state.go('root.building')
        }


        $scope.gotoCreate = function() {
            $state.go('root.buildingtherapyavailable.create')
        };


        $scope.delete = function(availableId, model) {

            // apiResource.resource('buildingtherapyavailable').getCopy(availableId).then(function(object) {
                var params = {
                    title: 'Atención',
                    text: 'Desea eliminar la disponibilidad.?'
                }
                $rootScope.openDeleteModal(params).then(function() {
                    var idx = _.findIndex($scope.models, function(el) {
                        return el.building_therapy_id == availableId;
                    });
                    if (idx > -1) {
                        $scope.models[idx] = model;
                        $scope.models[idx].$deleting = true;
                        $scope.models[idx].id = $scope.models[idx].building_therapy_id;
                        $scope.models[idx].$delete(function() {
                            TherapyAvailableService.messageFlag.title = "Disponibilidad eliminada correctamente";
                            TherapyAvailableService.messageFlag.type = "info";
                            $scope.messages = TherapyAvailableService.messageFlag;
                            $scope.hasMessage = true;
                            $scope.models[idx].$deleting = false;
                            $scope.models.splice(idx, 1);
                            apiResource.resource('buildingtherapyavailable').removeFromCache(id);
                        }, function(reason) {
                            $scope.saving = false;
                            $scope.models[idx].$deleting = false;
                            $scope.existError = true;
                            $scope.messages.title = reason.data.title;
                            $scope.messages.type = 'error';
                            if (reason.data.detail) {
                                $scope.messages.details = [];
                                var json = JSON.parse(reason.data.detail);
                                angular.forEach(json, function(elem, idx) {
                                    angular.forEach(elem, function(el, idex) {
                                        $scope.messages.details.push(el)
                                    })
                                })

                            }
                        })
                    }
                })
            // });
        }





    }]);


    app.register.controller('TherapyAvailableCreateCtrl', ['$scope', '$q', 'apiResource', 'TherapyAvailableService', 'envService', '$state', function($scope, $q, apiResource, TherapyAvailableService, envService, $state) {


        $scope.loading = true;
        $scope.messages = [];
        $existError = false;
        $hasMessage = false;
        $scope.messages = {};
        $scope.query = {

        };

        $scope.model = {};

        $scope.buildings = [];
        $scope.therapies = [];
        $scope.therapists = [];
        $scope.maxVailable = 0;
        var days = [];


        var reqWeekDayParameter = {
            method: 'GET',
            url: envService.read('api') + 'load-parameter/WEEK_DAYS'
        };



        var deps = $q.all([
            apiResource.resource('buildings').query().then(function(buildings) {
                $scope.buildings = buildings;
                $scope.query.building = $scope.buildings[0].id;
            }),

            apiResource.resource('therapies').query().then(function(therapies) {
                $scope.therapies = therapies;
            }),

            apiResource.resource('therapists').query().then(function(therapists) {
                $scope.therapists = therapists;
            }),
            apiResource.loadFromApi(reqWeekDayParameter).then(function(daysOfWeek) {
                days = daysOfWeek;
            }),

        ]);

        deps.then(function() {
            $scope.model = apiResource.resource('buildingtherapyavailable').create({ in_year: 2019, iv_timeframe_id: 'FIRST' });
            $scope.filterTherapies();
            $scope.loading = false;
        });


        $scope.filterTherapies = function() {

            if ($scope.query.therapy_id) $scope.query.therapy_id = null;

            if ($scope.query.therapist_id) $scope.query.therapist_id = null;

            if ($scope.query.key_day) $scope.query.key_day = null;

            $scope.therapies = TherapyAvailableService.filterTherapies($scope.query.building, $scope.buildings, $scope.therapies);
        }

        $scope.filterTerapists = function() {

            if ($scope.query.therapist_id) $scope.query.therapist_id = null;

            if ($scope.model.in_building_therapy_id) $scope.model.in_building_therapy_id = null;

            $scope.therapists = TherapyAvailableService.filterTerapists($scope.query, $scope.buildings, $scope.therapists);
        }

        $scope.getDaysSchedule = function() {
            $scope.schedules = TherapyAvailableService.getDays($scope.query, $scope.buildings);
        }

        $scope.getMaxAvailable = function() {
            $scope.maxVailable = TherapyAvailableService.getMaxAvailable($scope.schedules, $scope.model.in_building_therapy_id);
        }

        $scope.getDayValue = function(keyday) {
            return TherapyAvailableService.getDay(keyday, days);
        }


        $scope.save = function(form, returnIndex) {
            $scope.messages = {};

            if (form.validate()) {
                $scope.saving = true;
                $scope.model.$save(function(data) {

                    apiResource.resource('buildingtherapyavailable').setOnCache(data);
                    TherapyAvailableService.messageFlag.title = "Disponibilidad creada correctamente";
                    TherapyAvailableService.messageFlag.type = "info";
                    if (returnIndex) {
                        $state.go('root.buildingtherapyavailable');
                    } else {
                        $state.go('root.buildingtherapyavailable.edit', {
                            availableId: data.building_therapy_id
                        })
                    }


                }, function(reason) {
                    $scope.saving = false;
                    $scope.existError = true;
                    $scope.messages.title = reason.data.title;
                    $scope.messages.type = 'error';
                    if (reason.data.detail) {
                        $scope.messages.details = [];
                        var json = JSON.parse(reason.data.detail);
                        angular.forEach(json, function(elem, idx) {
                            angular.forEach(elem, function(el, idex) {
                                $scope.messages.details.push(el)
                            })
                        })

                    }
                });
            }
        }


        $scope.saveAndClose = function(form) {
            $scope.save(form, true);
        }


        $scope.gotoBuilding = function() {
            $state.go('root.building')
        }

        $scope.goToIndex = function() {
            $state.go('root.buildingtherapyavailable')
        }

    }]);


    app.register.controller('TherapyAvailableEditCtrl', ['$scope', '$q', 'apiResource', 'TherapyAvailableService', 'envService', '$state', '$stateParams', function($scope, $q, apiResource, TherapyAvailableService, envService, $state, $stateParams) {


        var availableId = $stateParams.availableId;

        $scope.loading = true;
        $scope.messages = [];
        $existError = false;
        $hasMessage = false;
        $scope.messages = {};
        $scope.query = {

        };

        $scope.model = {};

        $scope.buildings = [];
        $scope.therapies = [];
        $scope.therapists = [];
        $scope.maxVailable = 0;
        $scope.schedules = []
        var days = [];


        var reqWeekDayParameter = {
            method: 'GET',
            url: envService.read('api') + 'load-parameter/WEEK_DAYS'
        };



        var deps = $q.all([
            apiResource.resource('buildings').query().then(function(buildings) {
                $scope.buildings = buildings;
                $scope.query.building = $scope.buildings[0].id;
            }),

            apiResource.resource('therapies').query().then(function(therapies) {
                $scope.therapies = therapies;
            }),

            apiResource.resource('therapists').query().then(function(therapists) {
                $scope.therapists = therapists;
            }),
            apiResource.loadFromApi(reqWeekDayParameter).then(function(daysOfWeek) {
                days = daysOfWeek;
            }),

        ]);


        deps.then(function() {
            apiResource.resource('buildingtherapyavailable').get(availableId).then(function(result) {
                $scope.model = result;
                $scope.model.iv_avalability = $scope.model.avalability
                $scope.filterTherapies();
                $scope.query.therapy_id = TherapyAvailableService.getTherapyId($scope.query.building, $scope.model.building_therapy_id, $scope.buildings);
                $scope.filterTerapists();
                $scope.query.therapist_id = TherapyAvailableService.getTherapistId($scope.query.building, $scope.model.building_therapy_id, $scope.buildings);
                $scope.getDaysSchedule();
                $scope.model.in_building_therapy_id = $scope.model.building_therapy_id;
                $scope.getMaxAvailable()
                $scope.loading = false;
            });
        });


        $scope.filterTherapies = function() {

            if ($scope.query.therapy_id) $scope.query.therapy_id = null;

            if ($scope.query.therapist_id) $scope.query.therapist_id = null;

            if ($scope.query.key_day) $scope.query.key_day = null;

            $scope.therapies = TherapyAvailableService.filterTherapies($scope.query.building, $scope.buildings, $scope.therapies);
        }



        $scope.filterTerapists = function() {

            if ($scope.query.therapist_id) $scope.query.therapist_id = null;

            if ($scope.model.in_building_therapy_id) $scope.model.in_building_therapy_id = null;

            $scope.therapists = TherapyAvailableService.filterTerapists($scope.query, $scope.buildings, $scope.therapists);
        }

        $scope.getDaysSchedule = function() {
            $scope.schedules = TherapyAvailableService.getDays($scope.query, $scope.buildings);
        }

        $scope.getMaxAvailable = function() {
            $scope.maxVailable = TherapyAvailableService.getMaxAvailable($scope.schedules, $scope.model.in_building_therapy_id);
        }

        $scope.getDayValue = function(keyday) {
            return TherapyAvailableService.getDay(keyday, days);
        }


        $scope.save = function(form, returnIndex) {
            $scope.messages = {};

            if (form.validate()) {
                $scope.saving = true;
                $scope.model.id = availableId;
                $scope.model.$update(availableId, function(data) {


                    apiResource.resource('buildingtherapyavailable').setOnCache(data);
                    TherapyAvailableService.messageFlag.title = "Disponibilidad Actualizada correctamente";
                    TherapyAvailableService.messageFlag.type = "info";
                    $scope.hasMessage = true;
                    $scope.messages = TherapyAvailableService.messageFlag;
                    $scope.saving = false;
                    if (returnIndex) {
                        $state.go('root.buildingtherapyavailable');
                    } else {
                        $state.go('root.buildingtherapyavailable.edit', {
                            availableId: data.building_therapy_id
                        })
                    }


                }, function(reason) {
                    $scope.saving = false;
                    $scope.existError = true;
                    $scope.messages.title = reason.data.title;
                    $scope.messages.type = 'error';
                    if (reason.data.detail) {
                        $scope.messages.details = [];
                        var json = JSON.parse(reason.data.detail);
                        angular.forEach(json, function(elem, idx) {
                            angular.forEach(elem, function(el, idex) {
                                $scope.messages.details.push(el)
                            })
                        })

                    }
                });
            }
        }


        $scope.saveAndClose = function(form) {
            $scope.save(form, true);
        }


        $scope.gotoBuilding = function() {
            $state.go('root.building')
        }

        $scope.goToIndex = function() {
            $state.go('root.buildingtherapyavailable')
        }





    }])




})