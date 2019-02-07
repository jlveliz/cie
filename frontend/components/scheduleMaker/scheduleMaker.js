/**
 ** Schedule Maker controller
 **/
define(['app'], function(app) {

    app.register.service('ScheduleMakerService', ['apiResource', '$q', '$filter', '$uibModal', function(apiResource, $q, $filter, $uibModal) {


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

        _this.getTherapy = function(therapyId, therapies) {
            let found = _.findWhere(therapies, { id: therapyId });
            if (found) return found.name;

            return "-";
        };


        _this.filterTherapistFromBuildingTherapist = function(therapyId, buildingTherapies) {
            var filtered = _.filter(buildingTherapies, function(buildTherapy) {
                return buildTherapy.therapy_id == therapyId;
            });
            return _.unique(filtered, function(fil) {
                return fil.therapist_user_id;
            });
        }

        _this.filterDaysFromBuildingTherapy = function(therapistId, therapyId, buildingTherapies) {
            var filtered = _.filter(buildingTherapies, function(buildTherapy) {
                return buildTherapy.therapy_id == therapyId && buildTherapy.therapist_user_id == therapistId;
            });

            return filtered;
        }



        _this.addRemoveTherapyUser = function(buildingTherapyId, buildingId, action, therapiesSelecteds) {
            therapiesSelecteds = therapiesSelecteds || [];

            var deferred = $q.defer();

            apiResource.resource('buildings').queryCopy().then(function(results) {
                building = _.findWhere(results, { id: buildingId });

                if (building) {
                    var therapyBuilding = _.findWhere(building.therapies, { id: buildingTherapyId });

                    if (therapyBuilding) {
                        if (action == 'insert') {
                            therapiesSelecteds.push(therapyBuilding)
                        } else {
                            let idx = _.findIndex(therapiesSelecteds, { id: buildingTherapyId })
                            if (idx > -1) {
                                therapiesSelecteds.splice(idx, 1);
                            }
                        }
                        deferred.resolve(therapiesSelecteds);
                    }
                }



            })
            return deferred.promise;

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
        };


        _this.getCurrentQuarter = function(quartersArray) {
            let currentMonth  = (new Date()).getMonth();
            var founded = null
            quartersArray.forEach(function(element, index) {
                if (currentMonth >= parseInt(element.value) && currentMonth <= parseInt(element.value2)) {
                    founded = element;
                }
            });

            return founded;
        }


        _this.getSelecteds = function(buildingTherapies, therapiesUser) {

            var buildingsTherapies = [];
            angular.forEach(therapiesUser, function(theraUser) {
                let found = _.findWhere(buildingTherapies, { id: theraUser.building_therapy_id });
                if (found) {
                    buildingsTherapies.push(found);
                }
            })

            return buildingsTherapies;
        };


        _this.formatBuildingTherayUser = function(therapiesUser) {
            let therapyUsers = [];
            angular.forEach(therapiesUser, function(therapyUser) {
                therapyUsers.push(therapyUser.building_therapy_id)
            })

            return therapyUsers;
        };


        _this.openModalSearchBuildingTherapy = function(buildingTherapyId) {

            var deferred = $q.defer();

            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: false,
                templateUrl: 'frontend/components/scheduleMaker/modal-search-building-therapy.html',
                resolve: {
                    modalContent: function() {
                        return buildingTherapyId
                    }
                },
                controller: 'BuildingTherapy'

            });

            modalInstance.result.then(function(result) {
                deferred.resolve(result)
            })
            return deferred.promise;
        };

        _this.filterBuildingTherapies = function(query, buildingTherapies) {
            var filtered = _.filter(buildingTherapies, function(buildTherapy) {
                return buildTherapy.therapy_id == query.therapies && buildTherapy.therapist_user_id == query.therapist && buildTherapy.key_day == query.day;
            });
            var filteres = [];
            filtered.forEach(function(element, index) {
                element.availables.forEach( function(available, index) {
                    if (available.year == query.year && available.timeframe_id == query.currentQuarter.idparameter && query.currentQuarter.idgroup == 'YEAR_QUARTER') {
                        filteres.push(available)
                    }
                });
            });

            
            return filteres;


        }

        _this.getScheduleBuildingTherapy = function(buildingTherpyId, buildingTherapies) {
            var buildTherapyF = _.findWhere(buildingTherapies, {id : buildingTherpyId}) ;

            if (buildTherapyF)
                return buildTherapyF.schedule.start +' - ' + buildTherapyF.schedule.end;
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
                            ScheduleMakerService.messageFlag.title = "horario eliminado correctamente";
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
        $scope.therapiesSelecteds = []
        $scope.therapies = [];
        $scope.therapists = [];
        $scope.therapists = [];
        $scope.quarters = [];
        $scope.messages = {};
        $scope.opt = {
            building: null
        }
        var arrTherapies = [];
        $scope.therapiesOfBuilding = [];

        var reqKeyParameter = {
            method: 'GET',
            url: envService.read('api') + 'load-parameter/WEEK_DAYS'
        };

        var reqKeyQuarterParameter = {
            method: 'GET',
            url: envService.read('api') + 'load-parameter/YEAR_QUARTER'
        };

        var deps = $q.all([
            apiResource.loadFromApi(reqKeyQuarterParameter).then(function(quarters) {
                $scope.quarters = quarters;
            }),
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
            // angular.forEach($scope.therapiesOfBuilding, function(building) {
            //     angular.forEach(building.therapies, function(therapy) {
            //         therapy.$selected = false;
            //     })
            // })
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
                $scope.model.year = (new Date()).getFullYear();
                $scope.model.group_time_id = "YEAR_QUARTER";
                $scope.model.timeframe_id = "FIRST";
                $scope.model.start_date = new Date("2019-01-25");
                $scope.model.end_date = new Date("2019-04-30");
                $scope.model.building_therapies = []
                // if (!$scope.model.patientUser.representant_id) {
                    $scope.foundUser = true;
                // }

            });
        };


        $scope.addToSchedule = function(buildingTherapyId) {
            $scope.model.building_therapies.push(buildingTherapyId);
            ScheduleMakerService.addRemoveTherapyUser(buildingTherapyId, $scope.opt.building, 'insert', $scope.therapiesSelecteds).then(function(results) {
                $scope.therapiesSelecteds = results
            })
        };

        $scope.removeSchedule = function(therapyBuild) {

            var idx = $scope.model.building_therapies.indexOf(therapyBuild);
            if (idx > -1) $scope.model.building_therapies.splice(idx, 1);

            ScheduleMakerService.addRemoveTherapyUser(therapyBuild, $scope.opt.building, 'remove', $scope.therapiesSelecteds).then(function(results) {
                $scope.therapiesSelecteds = results
            })


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

        $scope.openModalSearchBuildingTherapy = function() {
            ScheduleMakerService.openModalSearchBuildingTherapy($scope.opt.building).then(function(result) {
                $scope.addToSchedule(result)
            })
        }


        $scope.getDay = function(keyday) {
            return ScheduleMakerService.getDay(keyday, $scope.daysOfWeek);
        }

        $scope.getTherapist = function(therapistUserId) {
            return ScheduleMakerService.getTherapist(therapistUserId, $scope.therapists)
        }

        $scope.getTherapy = function(therapyId) {
            return ScheduleMakerService.getTherapy(therapyId, $scope.therapies)
        }

        $scope.inserToTherapyUser = function(therapyBuildId, selected) {
            $scope.model.building_therapies = ScheduleMakerService.addRemoveTherapyUser(therapyBuildId, selected, $scope.model.building_therapies)
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
                        schedule: data.id
                    })
                }
            }

            var failCallback = function(reason) {
                $scope.saving = false
                $scope.existError = true;
                $scope.messages.title = reason.data.title;
                $scope.messages.type = 'error';
                $scope.messages.details = [];
                 if (reason.data.detail) {
                    var json = JSON.parse(reason.data.detail);
                    angular.forEach(json, function(elem, idx) {
                        angular.forEach(elem, function(el, idex) {
                            $scope.messages.details.push(el)
                        })
                    })
                }
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
        $scope.therapiesSelecteds = [];
        $scope.models = [];
        $scope.isEdit = true
        $scope.foundUser = true;
        $scope.hasMessage = false;
        $scope.hasError = false;
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
                    // $scope.therapies = ScheduleMakerService.makeVisibleTherapies($scope.therapies, building.therapies);
                    $scope.therapiesSelecteds = ScheduleMakerService.getSelecteds(building.therapies, $scope.model.therapies);
                }

                $scope.model.building_therapies = ScheduleMakerService.formatBuildingTherayUser($scope.model.therapies);
                $scope.loading = false;
                $scope.messages = ScheduleMakerService.messageFlag;
                if (!_.isEmpty($scope.messages)) {
                    $scope.hasMessage = true;
                    ScheduleMakerService.messageFlag = {};
                }
            });
        });


        $scope.addToSchedule = function(buildingTherapyId) {
            $scope.model.building_therapies.push(buildingTherapyId);
            ScheduleMakerService.addRemoveTherapyUser(buildingTherapyId, $scope.opt.building, 'insert', $scope.therapiesSelecteds).then(function(results) {
                $scope.therapiesSelecteds = results
                $scope.model.therapies.push({id:0,patient_user_id:$scope.model.id,year:"2019",grouptime_id:"YEAR_QUARTER",timeframe_id:"FIRST", building_therapy_id: buildingTherapyId});
            })
            
        };

        $scope.removeSchedule = function(therapyBuild) {

            var idx = $scope.model.building_therapies.indexOf(therapyBuild);
            if (idx > -1) $scope.model.building_therapies.splice(idx, 1);

            ScheduleMakerService.addRemoveTherapyUser(therapyBuild, $scope.opt.building, 'remove', $scope.therapiesSelecteds).then(function(results) {
                $scope.therapiesSelecteds = results
                var idx = _.findIndex($scope.model.therapies,function(item){
                    return item.building_therapy_id == therapyBuild;
                });
                $scope.model.therapies.splice(idx,1);
            })


        };

        $scope.openModalSearchBuildingTherapy = function() {
            ScheduleMakerService.openModalSearchBuildingTherapy($scope.opt.building).then(function(result) {
                $scope.addToSchedule(result)
            })
        }

        $scope.getDay = function(keyday) {
            return ScheduleMakerService.getDay(keyday, $scope.daysOfWeek);
        }

        $scope.getTherapist = function(therapistUserId) {
            return ScheduleMakerService.getTherapist(therapistUserId, $scope.therapists)
        }

        $scope.getTherapy = function(therapyId) {
            return ScheduleMakerService.getTherapy(therapyId, $scope.therapies)
        }


        $scope.goToIndex = function() {
            $state.go('root.scheduleMaker')
        };

        $scope.inserToTherapyUser = function(therapyBuild) {
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
                if (reason.data.detail) {
                    var json = JSON.parse(reason.data.detail);
                    angular.forEach(json, function(elem, idx) {
                        angular.forEach(elem, function(el, idex) {
                            $scope.messages.details.push(el)
                        })
                    })
                }
            }


            if (saveForm.validate()) {
                $scope.saving = true;
                $scope.model.year = $scope.model.therapies[0].year;
                $scope.model.timeframe_id = $scope.model.therapies[0].timeframe_id;
                $scope.model.grouptime_id = $scope.model.therapies[0].grouptime_id;
                $scope.model.patient_user_id = $scope.model.therapies[0].patient_user_id;
                $scope.model.therapyUsersSelecteds = $scope.therapiesSelecteds;
                ScheduleMakerService.save($scope.model).then(successCallback, failCallback);
            }
        }

    }])


    app.register.controller('BuildingTherapy', ['$scope', 'modalContent', '$uibModalInstance', '$q', 'apiResource', 'ScheduleMakerService', 'envService', function($scope, modalContent, $uibModalInstance, $q, apiResource, ScheduleMakerService, envService) {

        var buildId = modalContent;
        var deferred = $q.defer();
        var therapiesArray = [];
        var therapistsArray = [];
        var daysOfWeekArray = [];
        var quartersArray = [];
        $scope.therapists = [];
        $scope.building = {};
        $scope.query = {
            therapies: false,
            therapist: false,
            day: false,
            year: (new Date()).getFullYear(),
            currentQuarter : {}
        };

        var reqKeyParameter = {
            method: 'GET',
            url: envService.read('api') + 'load-parameter/WEEK_DAYS'
        };

        var reqKeyQuarterParameter = {
            method: 'GET',
            url: envService.read('api') + 'load-parameter/YEAR_QUARTER'
        };



        var deps = $q.all([
            apiResource.loadFromApi(reqKeyQuarterParameter).then(function(quarters) {
                quartersArray = quarters;
            }),
            apiResource.loadFromApi(reqKeyParameter).then(function(daysOfWeek) {
                daysOfWeekArray = daysOfWeek;
            }),
            apiResource.resource('therapies').query().then(function(therapies) {
                therapiesArray = therapies;
            }),
            apiResource.resource('therapists').queryCopy().then(function(therapists) {
                therapistsArray = therapists;
            })
        ])

        deps.then(function() {
            apiResource.resource('buildings').getCopy(buildId).then(function(result) {
                $scope.building = result;
                $scope.query.grouptime_id = "YEAR_QUARTER";
                $scope.query.currentQuarter = ScheduleMakerService.getCurrentQuarter(quartersArray);
                
                $scope.therapies = ScheduleMakerService.makeVisibleTherapies(therapiesArray, $scope.building.therapies);
            });
        });


        $scope.filterTherapist = function(therapyId) {
            $scope.therapists = ScheduleMakerService.filterTherapistFromBuildingTherapist(therapyId, $scope.building.therapies);
        }

        $scope.getTherapist = function(therapistUserId) {
            return ScheduleMakerService.getTherapist(therapistUserId, therapistsArray);
        }


        $scope.filterDays = function(therapistId) {
            $scope.daysTherapy = ScheduleMakerService.filterDaysFromBuildingTherapy(therapistId, $scope.query.therapies, $scope.building.therapies)
        }

        $scope.getDay = function(keyday) {
            return ScheduleMakerService.getDay(keyday, daysOfWeekArray);
        }

        $scope.selectBuildingTherapy = function() {
            $scope.loading = true;
            $scope.buildingTherapies = ScheduleMakerService.filterBuildingTherapies($scope.query, $scope.building.therapies);
            $scope.loading = false;
        }


        $scope.getSchedule = function(buildingTherpyId) {
            return ScheduleMakerService.getScheduleBuildingTherapy(buildingTherpyId, $scope.building.therapies);
        }


        $scope.selectAndClose = function(buildtherapyId) {
            deferred.resolve(buildtherapyId);
            $uibModalInstance.close(buildtherapyId);
        }

    }])





})