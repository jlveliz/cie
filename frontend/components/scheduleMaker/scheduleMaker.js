/**
 ** Schedule Maker controller
 **/
define(['app'], function(app) {

    app.register.service('ScheduleMakerService', ['apiResource', '$q', '$filter', function(apiResource, $q, $filter) {


        var _this = this;

        _this.messageFlag = {};

        _this.getTherapiesOfBuilding = function(aaTherapies, build) {
            var therapies = [];
            angular.forEach(aaTherapies, function(therapy) {
                let founded = _.findWhere(build.therapies, { therapy_id: therapy.id });
                if (founded) {
                    therapies.push(therapy);
                }
            })


            return therapies;

        };

        _this.makeVisibleTherapies = function(therapies, buildingTherapies) {
            angular.forEach(therapies, function(therapy) {
                therapy.$existSchedule = false;
                let founded = _.findWhere(buildingTherapies, { therapy_id: therapy.id })
                if (founded) {
                    therapy.$existSchedule = true;
                }
            });

            return therapies;
        };

        _this.getDay = function(keyDay, daysOfWeek) {
            let found = _.findWhere(daysOfWeek, { idparameter: keyDay });
            if (found) return $filter('capitalize')(found.value, 'oneLetter')
        };


        _this.getTherapist = function(therapistUserId, therapists) {
            let found = _.findWhere(therapists, { id: therapistUserId });
            if (found) return $filter('capitalize')(found.person.name, 'oneLetter') + ' ' + $filter('capitalize')(found.person.last_name, 'oneLetter');

            return "-";
        };


        _this.addRemoveTherapyUser = function(therapyBuild, selected, therapyUser) {

            if (selected) {
                therapyUser.push(therapyBuild)
            } else {
                let idx = therapyUser.indexOf(therapyBuild)
                if (idx > -1) {
                    therapyUser.splice(idx, 1);
                }
            }
            return therapyUser;
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


        _this.getBuilding = function(therapies) {
            let buildId = null;

            buildings = [];
            angular.forEach(therapies, function(therapy) {
                buildings.push(therapy.building_therapy.build_id)
            });



            return buildId = buildings[0];
        }


        _this.getSelecteds = function(buildingTherapies, therapiesUser) {
            angular.forEach(therapiesUser, function(theraUser) {
                let found = _.findWhere(buildingTherapies, { id: theraUser.building_therapy_id });
                if (found) {
                    found.$selected = true;
                } else {
                    found.$selected = false;
                }
            })

            return buildingTherapies;
        };


        _this.formatBuildingTherayUser = function(therapiesUser) {
            let therapyUsers = [];
            angular.forEach(therapiesUser, function(therapyUser) {
                therapyUsers.push(therapyUser.building_therapy_id)
            })

            return therapyUsers;
        }




    }]);

    app.register.controller('ScheduleIdxCtrl', ['$scope', 'apiResource', '$stateParams', 'DTOptionsBuilder', 'ScheduleMakerService', '$rootScope', '$state', function($scope, apiResource, $stateParams, DTOptionsBuilder, ScheduleMakerService, $rootScope, $state) {

        $scope.loading = true;
        $scope.models = [];

        apiResource.resource('buildingtherapyUser').query().then(function(results) {
            $scope.models = results;
            $scope.loading = false;
        })

        $scope.goToCreate = function() {
            $state.go('root.scheduleMaker.create')
        }

        $scope.delete = function(id) {
            apiResource.resource('buildingtherapyUser').getCopy(id).then(function(object) {
                var params = {
                    title: 'Atención',
                    text: 'Desea eliminar el el horario de ' + object.name + '.?'
                }
                $rootScope.openDeleteModal(params).then(function() {
                    var idx = _.findIndex($scope.models, function(el) {
                        return el.id == object.id;
                    });
                    if (idx > -1) {
                        $scope.models[idx].$deleting = true;
                        object.$delete(function() {
                            ScheduleMakerService.messageFlag.title = "orario eliminado correctamente";
                            ScheduleMakerService.messageFlag.type = "info";
                            $scope.messages = ScheduleMakerService.messageFlag;
                            $scope.hasMessage = true;
                            $scope.models[idx].$deleting = false;
                            $scope.models.splice(idx, 1);
                            apiResource.resource('buildingtherapyUser').removeFromCache(object.id);
                        })
                    }
                })
            });
        }

    }])

    app.register.controller('ScheduleCreateCtrl', ['$scope', 'apiResource', '$stateParams', 'ScheduleMakerService', '$rootScope', '$state', 'envService', '$q', function($scope, apiResource, $stateParams, ScheduleMakerService, $rootScope, $state, envService, $q) {

        $scope.loading = false;
        $scope.models = [];
        $scope.isEdit = false
        $scope.foundUser = false;
        $scope.daysOfWeek = [];
        $scope.buildings = [];
        $scope.therapies = [];
        $scope.therapists = [];
        $scope.opt = {
            building: null
        }
        var arrTherapies = [];
        $scope.therapiesOfBuilding = [];

        var reqKeyParameter = {
            method: 'GET',
            url: envService.read('api') + 'load-parameter/WEEK_DAYS'
        };

        var deps = $q.all([
            apiResource.loadFromApi(reqKeyParameter).then(function(daysOfWeek) {
                $scope.daysOfWeek = daysOfWeek;
            }),
            apiResource.resource('buildings').query().then(function(buildings) {
                $scope.buildings = buildings;
            }),
            apiResource.resource('therapies').query().then(function(therapies) {
                $scope.therapies = therapies;
            }),
            apiResource.resource('therapists').queryCopy().then(function(therapists) {
                $scope.therapists = therapists;
            })
        ]);


        deps.then(function() {
            angular.forEach($scope.therapiesOfBuilding, function(building) {
                angular.forEach(building.therapies, function(therapy) {
                    therapy.$selected = false;
                })
            })
            $scope.model = apiResource.resource('buildingtherapyUser').create({ building_therapies: [] });
        })

        $scope.goToIndex = function() {
            $state.go('root.scheduleMaker')
        };

        $scope.openModalSearchUser = function() {
            let params = { resource: 'buildingtherapyUser' };
            $rootScope.openModalSearchUser(params).then(function(patientUser) {
                $scope.existPatientUserSelected = true;
                $scope.model.patientUser = patientUser;
                $scope.model.patient_user_id = $scope.model.patientUser.id;
                $scope.model.year = 2019;
                $scope.model.group_time_id = "YEAR_QUARTER";
                $scope.model.timeframe_id = "FIRST";
                $scope.model.start_date = new Date("2019-01-25");
                $scope.model.end_date = new Date("2019-04-30");
                $scope.model.building_therapies = []

                if (!$scope.model.patientUser.representant_id) {
                    $scope.foundUser = true;
                }

            });
        };


        $scope.addToSchedule = function(buildingTherapyId, Selected) {
            $scope.model.building_therapies = ScheduleMakerService.updateBuildingsTherapies($scope.model.building_therapies, buildingTherapyId, Selected);
        };

        $scope.selectBuilding = function(buildingId) {
            let building = _.findWhere($scope.buildings, {
                id: buildingId
            });

            if (building) {
                $scope.therapiesOfBuilding = building.therapies;
                $scope.therapies = ScheduleMakerService.makeVisibleTherapies($scope.therapies, building.therapies);

            }
        };


        $scope.getDay = function(keyday) {
            return ScheduleMakerService.getDay(keyday, $scope.daysOfWeek);
        }

        $scope.getTherapist = function(therapistUserId) {
            return ScheduleMakerService.getTherapist(therapistUserId, $scope.therapists)
        }

        $scope.inserToTherapyUser = function(therapyBuild, selected) {
            $scope.model.building_therapies = ScheduleMakerService.addRemoveTherapyUser(therapyBuild, selected, $scope.model.building_therapies)
        }


        $scope.save = function(saveForm, returnIndex) {

            var successCallback = function(data) {
                $scope.saving = false;
                $scope.hasMessage = true;
                apiResource.resource('buildingtherapyUser').setOnCache(data);
                ScheduleMakerService.messageFlag.title = "Se ha asignado el horario correctamente";
                ScheduleMakerService.messageFlag.type = "info";
                $scope.messages = ScheduleMakerService.messageFlag;
                if (returnIndex) {
                    $state.go('root.scheduleMaker');
                } else {
                    $state.go('root.scheduleMaker.edit', {
                        pUserId: data.id
                    })
                }
            }

            var failCallback = function(reason) {
                $scope.saving = false
                $scope.existError = true;
                $scope.messages.title = reason.data.title;
                $scope.messages.type = 'error';
                $scope.messages.details = [];
                var json = JSON.parse(reason.data.detail);
                angular.forEach(json, function(elem, idx) {
                    angular.forEach(elem, function(el, idex) {
                        $scope.messages.details.push(el)
                    })
                })
            }


            if (saveForm.validate()) {
                $scope.saving = true;
                ScheduleMakerService.save($scope.model).then(successCallback, failCallback);
            }
        }


    }])

    app.register.controller('ScheduleEditCtrl', ['$scope', 'apiResource', '$stateParams', 'ScheduleMakerService', '$rootScope', '$state', '$rootScope', 'envService', '$q', function($scope, apiResource, $stateParams, ScheduleMakerService, $rootScope, $state, $rootScope, envService, $q) {

        $scope.loading = true;
        var scheduleId = $stateParams.schedule;
        $scope.models = [];
        $scope.isEdit = true
        $scope.foundUser = true;
        $scope.daysOfWeek = [];
        $scope.buildings = [];
        $scope.therapies = [];
        $scope.therapists = [];
        $scope.opt = {
            building: null
        }

        var reqKeyParameter = {
            method: 'GET',
            url: envService.read('api') + 'load-parameter/WEEK_DAYS'
        };

        var deps = $q.all([
            apiResource.loadFromApi(reqKeyParameter).then(function(daysOfWeek) {
                $scope.daysOfWeek = daysOfWeek;
            }),
            apiResource.resource('buildings').query().then(function(buildings) {
                $scope.buildings = buildings;
            }),
            apiResource.resource('therapies').query().then(function(therapies) {
                $scope.therapies = therapies;
            }),
            apiResource.resource('therapists').queryCopy().then(function(therapists) {
                $scope.therapists = therapists;
            })
        ]);

        deps.then(function() {
            apiResource.resource('buildingtherapyUser').getCopy(scheduleId).then(function(result) {

                $scope.model = result;
                $scope.opt.building = ScheduleMakerService.getBuilding(result.therapies);

                if ($scope.opt.building) {
                    let building = _.findWhere($scope.buildings, {
                        id: $scope.opt.building
                    });
                    $scope.therapiesOfBuilding = ScheduleMakerService.getSelecteds(building.therapies, $scope.model.therapies);
                    $scope.therapies = ScheduleMakerService.makeVisibleTherapies($scope.therapies, building.therapies);
                }

                $scope.model.building_therapies = ScheduleMakerService.formatBuildingTherayUser($scope.model.therapies);
                $scope.loading = false;
            });
        });

        $scope.getDay = function(keyday) {
            return ScheduleMakerService.getDay(keyday, $scope.daysOfWeek);
        }

        $scope.getTherapist = function(therapistUserId) {
            return ScheduleMakerService.getTherapist(therapistUserId, $scope.therapists)
        }

        $scope.goToIndex = function() {
            $state.go('root.scheduleMaker')
        };

        $scope.inserToTherapyUser = function(therapyBuild, selected) {
            $scope.model.building_therapies = ScheduleMakerService.addRemoveTherapyUser(therapyBuild, selected, $scope.model.building_therapies)
        };


        $scope.save = function(saveForm, returnIndex) {

            var successCallback = function(data) {
                $scope.saving = false;
                $scope.hasMessage = true;
                apiResource.resource('buildingtherapyUser').setOnCache(data);

                $scope.model = data;
                $scope.opt.building = ScheduleMakerService.getBuilding(data.therapies);

                if ($scope.opt.building) {
                    let building = _.findWhere($scope.buildings, {
                        id: $scope.opt.building
                    });
                    $scope.therapiesOfBuilding = ScheduleMakerService.getSelecteds(building.therapies, $scope.model.therapies);
                    $scope.therapies = ScheduleMakerService.makeVisibleTherapies($scope.therapies, building.therapies);
                }

                $scope.model.building_therapies = ScheduleMakerService.formatBuildingTherayUser($scope.model.therapies);


                ScheduleMakerService.messageFlag.title = "Se ha actualizado el horario correctamente";
                ScheduleMakerService.messageFlag.type = "info";
                $scope.messages = ScheduleMakerService.messageFlag;
                if (returnIndex) {
                    $state.go('root.scheduleMaker');
                }
            }

            var failCallback = function(reason) {
                $scope.saving = false
                $scope.existError = true;
                $scope.messages.title = reason.data.title;
                $scope.messages.type = 'error';
                $scope.messages.details = [];
                var json = JSON.parse(reason.data.detail);
                angular.forEach(json, function(elem, idx) {
                    angular.forEach(elem, function(el, idex) {
                        $scope.messages.details.push(el)
                    })
                })
            }


            if (saveForm.validate()) {
                $scope.saving = true;
                console.log($scope.model)
                ScheduleMakerService.save($scope.model).then(successCallback, failCallback);
            }
        }




    }])





})