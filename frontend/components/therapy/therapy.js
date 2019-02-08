
/**
 ** Therapy controller
 **/
define(['app'], function(app) {

    app.register.service('TherapyService', function() {

        var _this = this;

        _this.messageFlag = {};

    })

    app.register.controller('TherapyIdxCtrl', ['$scope', 'apiResource', '$stateParams', 'DTOptionsBuilder', 'TherapyService', '$rootScope', '$state', function($scope, apiResource, $stateParams, DTOptionsBuilder, TherapyService, $rootScope, $state) {

        $scope.therapies = [];
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

        apiResource.resource('therapies').query().then(function(results) {
            $scope.loading = false;
            $scope.therapies = results;
            $scope.messages = TherapyService.messageFlag;
            if (!_.isEmpty($scope.messages)) {
                $scope.hasMessage = true;
                TherapyService.messageFlag = {};
            }
        });

        $scope.delete = function(id) {
            apiResource.resource('therapies').getCopy(id).then(function(object) {
                var params = {
                    title: 'Atención',
                    text: 'Desea eliminar el terapia ' + object.name + '.?'
                }
                $rootScope.openDeleteModal(params).then(function() {
                    var idx = _.findIndex($scope.therapies, function(el) {
                        return el.id == object.id;
                    });
                    if (idx > -1) {
                        $scope.therapies[idx].$deleting = true;
                        object.$delete(function() {
                            TherapyService.messageFlag.title = "Terapia eliminada correctamente";
                            TherapyService.messageFlag.type = "info";
                            $scope.messages = TherapyService.messageFlag;
                            $scope.hasMessage = true;
                            $scope.therapies[idx].$deleting = false;
                            $scope.therapies.splice(idx, 1);
                            apiResource.resource('therapies').removeFromCache(id);
                        })
                    }
                })
            });
        };

        $scope.goToCreate = function() {
            $state.go('root.therapy.create')
        }

    }]);

    app.register.controller('TherapyCreateCtrl', ['$scope', 'apiResource', '$stateParams', '$state', 'TherapyService', '$q', 'envService','$filter',function($scope, apiResource, $stateParams, $state, TherapyService, $q,envService, $filter) {

        $scope.saving = false;
        $scope.loading = true;
        $scope.model = {};
        $scope.listPermissions = [];
        $scope.messages = [];
        $scope.typeTherapies = [];


      

        var deps = $q.all([
            apiResource.resource('tp-therapies').query().then(function(therapies) {
                $scope.typeTherapies = therapies;
            })
        ])

        deps.then(function() {
            $scope.loading = false;
            $scope.model = apiResource.resource('therapies').create();
        })


        $scope.save = function(form, returnIndex) {
            $scope.messages = {};
            if (form.validate()) {
                $scope.saving = true;
                $scope.model.$save(function(data) {
                    apiResource.resource('therapies').setOnCache(data);
                    TherapyService.messageFlag.title = "Terapia creado correctamente";
                    TherapyService.messageFlag.type = "info";
                    $scope.saving = false;
                    if (returnIndex) {
                        $state.go('root.therapy');
                    } else {
                        $state.go('root.therapy.edit', {
                            therapyId: data.id
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
            $state.go('root.therapy')
        }

    }]);

    app.register.controller('TherapyEditCtrl', ['$scope', 'apiResource', '$stateParams', '$state', 'TherapyService', '$q','envService', function($scope, apiResource, $stateParams, $state, TherapyService, $q, envService) {

        var therapyId = $stateParams.therapyId;
        $scope.isEdit = true;
        $scope.typeTherapies = [];


        var reqKeyParameter = {
            method: 'GET',
            url: envService.read('api') + 'load-parameter/WEEK_DAYS'
        };

        var deps = $q.all([
            apiResource.resource('tp-therapies').query().then(function(therapies) {
                $scope.typeTherapies = therapies;
            })
        ])

        $scope.loading = true;
        $scope.model = {};
        $scope.messages = {};
        $scope.existError = false;

        deps.then(function() {
            apiResource.resource('therapies').get(therapyId).then(function(model) {
                $scope.model = model;
                $scope.messages = TherapyService.messageFlag;
                if (!_.isEmpty($scope.messages)) {
                    $scope.hasMessage = true;
                    TherapyService.messageFlag = {};
                }
                $scope.loading = false;
            });
        })


        // $scope.validateOptions = {
        //     rules: {
        //         name: {
        //             required: true,
        //             // unique: 'therapy,name,' + therapyId
        //         },
        //         province_id: {
        //             required: true,
        //             valueNotEquals: '?',
        //         }
        //     },
        //     messages: {
        //         name: {
        //             required: "Campo requerido",
        //             // unique: 'la Terapia ya fue tomada'
        //         },
        //         province_id: {
        //             required: "Campo requerido",
        //             valueNotEquals: 'Campo requerido',
        //         }
        //     }

        // };

        $scope.save = function(form, returnIndex) {
            $scope.messages = {};
            if (form.validate()) {
                $scope.saving = true;
                $scope.model.key = therapyId;
                $scope.model.$update(therapyId, function(data) {
                    $scope.saving = false;
                    $scope.hasMessage = true;
                    apiResource.resource('therapies').setOnCache(data);
                    TherapyService.messageFlag.title = "Terapia " + $scope.model.name + " Actualizado correctamente";
                    TherapyService.messageFlag.type = "info";
                    $scope.messages = TherapyService.messageFlag;
                    if (returnIndex) {
                        $state.go('root.therapy');
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
            $state.go('root.therapy')
        }

    }]);


});