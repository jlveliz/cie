/**
 ** Schedule Maker controller
 **/
define(['app'], function(app) {

    app.register.service('ScheduleMakerService', ['apiResource', function(apiResource) {


        var _this = this;

        _this.messageFlag = {};




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
        $scope.buildingTherapy = [];

        var reqKeyParameter = {
            method: 'GET',
            url: envService.read('api') + 'load-parameter/WEEK_DAYS'
        };

        var deps = $q.all([
                apiResource.loadFromApi(reqKeyParameter).then(function(daysOfWeek) {
                    $scope.daysOfWeek = daysOfWeek;
                }),
                apiResource.resource('buildings').query().then(function(buildingTherapy) {
                    $scope.buildingTherapy = buildingTherapy;
                }),
            ]);


        deps.then(function() {
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
                $scope.model.time_frame_id = "FIRST";
                $scope.model.therapies = [];

                if (!$scope.model.patientUser.representant_id) {
                    $scope.foundUser = true;
                }

            });
        };


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