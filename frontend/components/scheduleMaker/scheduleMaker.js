/**
 ** Schedule Maker controller
 **/
define(['app'], function(app) {

    app.register.service('ScheduleMakerService', ['apiResource', '$q', function(apiResource, $q) {


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

        _this.updateBuildingsTherapies = function(currentBuildingTherapies, buildingTherapyId, selected) {
            if (selected) {
                currentBuildingTherapies.push(buildingTherapyId);
            } else {
                let idx = _.indexOf(currentBuildingTherapies, buildingTherapyId);
                if (idx > -1) currentBuildingTherapies.splice(idx, 1);
            }

            return currentBuildingTherapies;
        };


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
        var arrBuildTherapies = [];
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
            apiResource.resource('buildings').query().then(function(buildingTherapy) {
                arrBuildTherapies = buildingTherapy;
            }),
            apiResource.resource('therapies').query().then(function(therapies) {
                arrTherapies = therapies;
            }),
        ]);


        deps.then(function() {
            $scope.therapiesOfBuilding = ScheduleMakerService.getTherapiesOfBuilding(arrTherapies, arrBuildTherapies[0]);
            angular.forEach($scope.therapiesOfBuilding, function(building) {
                angular.forEach(building.therapies, function(therapy) {
                    therapy.$selected = false;
                })
            })
            $scope.model = apiResource.resource('buildingtherapyUser').create();
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
                $scope.model.start_date = "2019-01-25";
                $scope.model.end_date = "2019-04-30";
                $scope.model.building_therapies = [];

                if (!$scope.model.patientUser.representant_id) {
                    $scope.foundUser = true;
                }

            });
        };


        $scope.addToSchedule = function(buildingTherapyId, Selected) {
            $scope.model.building_therapies = ScheduleMakerService.updateBuildingsTherapies($scope.model.building_therapies, buildingTherapyId, Selected);
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

    app.register.controller('ScheduleEditCtrl', ['$scope', 'apiResource', '$stateParams', 'ScheduleMakerService', '$rootScope', '$state', '$rootScope', function($scope, apiResource, $stateParams, ScheduleMakerService, $rootScope, $state, $rootScope) {

        $scope.loading = true;
        $scope.isEdit = true
        $scope.models = {};
        let pUserId = $stateParams.pUserId;


        apiResource.resource('buildingtherapyUser').getCopy(pUserId).then(function(result) {
            $scope.loading = false;
            $scope.model = result;
        });

    }])





})