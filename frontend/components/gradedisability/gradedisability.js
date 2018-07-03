/**
 ** GradeDisability controller
 **/
define(['app'], function(app) {

    app.register.service('GradeDisabilityService', function() {

        var _this = this;

        _this.messageFlag = {};
    })

    app.register.controller('GradeDisabilityIdxCtrl', ['$scope', 'apiResource', '$stateParams', 'DTOptionsBuilder', 'GradeDisabilityService', '$rootScope', function($scope, apiResource, $stateParams, DTOptionsBuilder, GradeDisabilityService, $rootScope) {

        $scope.grades = [];
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

        apiResource.resource('grades-disability').query().then(function(results) {
            $scope.loading = false;
            $scope.grades = results;
            $scope.messages = GradeDisabilityService.messageFlag;
            if (!_.isEmpty($scope.messages)) {
                $scope.hasMessage = true;
                GradeDisabilityService.messageFlag = {};
            }
        });

        $scope.delete = function(id) {
            apiResource.resource('grades-disability').getCopy(id).then(function(object) {
                var params = {
                    title: 'Atención',
                    text: 'Desea eliminar el grado de discapacidad ' + object.name + '.?'
                }
                $rootScope.openDeleteModal(params).then(function() {
                    var idx = _.findIndex($scope.grades, function(el) {
                        return el.id == object.id;
                    });
                    if (idx > -1) {
                        $scope.grades[idx].$deleting = true;
                        object.$delete(function() {
                            GradeDisabilityService.messageFlag.title = "Grado de Discapacidad eliminada correctamente";
                            GradeDisabilityService.messageFlag.type = "info";
                            $scope.messages = GradeDisabilityService.messageFlag;
                            $scope.hasMessage = true;
                            $scope.grades[idx].$deleting = false;
                            $scope.grades.splice(idx, 1);
                            apiResource.resource('grades-disability').removeFromCache(id);
                        })
                    }
                })
            });
        }

    }]);

    app.register.controller('GradeDisabilityCreateCtrl', ['$scope', 'apiResource', '$stateParams', '$state', 'GradeDisabilityService', function($scope, apiResource, $stateParams, $state, GradeDisabilityService) {

        $scope.saving = false;
        $scope.loading = true;
        $scope.model = {};
        $scope.listPermissions = [];
        $scope.messages = [];
        $scope.provinces = [];


        $scope.loading = false;
        $scope.model = apiResource.resource('grades-disability').create();


        $scope.validateOptions = {
            rules: {
                name: {
                    required: true,
                    unique: 'grade_disability,name'
                }
            },
            messages: {
                name: {
                    required: "Campo requerido",
                    // unique: 'La Ciudad ya fue tomada'
                }
            }

        };

        $scope.save = function(form, returnIndex) {
            $scope.messages = {};
            if (form.validate()) {
                $scope.saving = true;
                $scope.model.$save(function(data) {
                    apiResource.resource('grades-disability').setOnCache(data);
                    GradeDisabilityService.messageFlag.title = "Grado de discapacidad creada correctamente";
                    GradeDisabilityService.messageFlag.type = "info";
                    if (returnIndex) {
                        $state.go('root.gradeDisability');
                    } else {
                        $state.go('root.gradeDisability.edit', {
                            gradeId: data.id
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

    app.register.controller('GradeDisabilityEditCtrl', ['$scope', 'apiResource', '$stateParams', '$state', 'GradeDisabilityService',  function($scope, apiResource, $stateParams, $state, GradeDisabilityService) {

        var gradeId = $stateParams.gradeId;
        $scope.isEdit = true;
        $scope.provinces = [];


        $scope.loading = true;
        $scope.model = {};
        $scope.messages = {};
        $scope.existError = false;

        apiResource.resource('grades-disability').getCopy(gradeId).then(function(model) {
            $scope.model = model;
            $scope.messages = GradeDisabilityService.messageFlag;
            if (!_.isEmpty($scope.messages)) {
                $scope.hasMessage = true;
                GradeDisabilityService.messageFlag = {};
            }
            $scope.loading = false;
        });
       

       $scope.validateOptions = {
            rules: {
                name: {
                    required: true,
                    // unique: 'grade_disability,name,'+$scope.model.id
                }
            },
            messages: {
                name: {
                    required: "Campo requerido",
                    // unique: 'La Ciudad ya fue tomada'
                }
            }

        };


        $scope.save = function(form, returnIndex) {
            $scope.messages = {};
            if (form.validate()) {
                $scope.saving = true;
                $scope.model.key = gradeId;
                $scope.model.$update(gradeId, function(data) {
                    $scope.saving = false;
                    $scope.hasMessage = true;
                    apiResource.resource('grades-disability').setOnCache(data);
                    GradeDisabilityService.messageFlag.title = "Grado de discapacidad " + $scope.model.name + " Actualizada correctamente";
                    GradeDisabilityService.messageFlag.type = "info";
                    $scope.messages = GradeDisabilityService.messageFlag;
                    if (returnIndex) {
                        $state.go('root.gradeDisability');
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