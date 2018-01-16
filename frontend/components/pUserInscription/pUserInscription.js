/**
 ** Inscriptions controller
 **/
define(['app'], function(app) {
    app.register.service('pUserInscriptionService', ['$q', function($q) {

        var _this = this;
        _this.messageFlag = {};

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

        _this.calculateAge = function(dateBirth) {
            if (!dateBirth) return "";
            var dateBirth = new Date(dateBirth);
            var currentDate = new Date();
            var age = currentDate.getFullYear() - dateBirth.getFullYear();
            var m = currentDate.getMonth() - dateBirth.getMonth();
            if (m < 0 || (m === 0 && currentDate.getDate() < dateBirth.getDate())) {
                age--;
            }
            return age;
        }


    }]);

    app.register.controller('pUserInscriptionIdxCtrl', ['$scope', 'apiResource', '$stateParams', 'DTOptionsBuilder', 'pUserInscriptionService', function($scope, apiResource, $stateParams, DTOptionsBuilder, pUserInscriptionService) {

        $scope.inscriptions = [];
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

        apiResource.resource('puserinscriptions').queryCopy().then(function(results) {
            $scope.loading = false;
            $scope.inscriptions = results;
            $scope.messages = pUserInscriptionService.messageFlag;
            if (!_.isEmpty($scope.messages)) {
                $scope.hasMessage = true;
                pUserInscriptionService.messageFlag = {};
            }
        });


    }]);

    app.register.controller('pUserInscriptionCreateCtrl', ['$scope', 'apiResource', '$stateParams', 'DTOptionsBuilder', 'pUserInscriptionService', '$q', function($scope, apiResource, $stateParams, DTOptionsBuilder, pUserInscriptionService, $q) {

        $scope.isEdit = false
        $scope.loading = true;
        $scope.model = {};
        $scope.provinces = [];
        $scope.cities = [];
        $scope.parishies = [];
        $scope.pathologies = [];


        $scope.porcentages = [];
        for (var i = 0; i <= 100; i++) {
            $scope.porcentages.push({
                id: i,
                value: i + ' %'
            })
        }


        var deps = $q.all([
            apiResource.resource('provinces').queryCopy().then(function(provinces) {
                $scope.provinces = provinces;
            }),
            apiResource.resource('cities').queryCopy().then(function(cities) {
                $scope.cities = cities;
            }),
            apiResource.resource('parishies').queryCopy().then(function(parishies) {
                $scope.parishies = parishies;
            }),
            apiResource.resource('pathologies').queryCopy().then(function(pathologies) {
                $scope.pathologies = pathologies;
            }),
        ]);

        deps.then(function() {
            $scope.model = apiResource.resource('puserinscriptions').create({
                has_diagnostic: null,
                city_id: null,
                parish_id: null,
                assist_other_therapeutic_center: null,
                receives_medical_attention: null,
                schooling: null
            });
            $scope.loading = false;
        });

        $scope.validateOptions = {
            rules: {
                num_identification: {
                    required: true,
                    min: 10,
                    max: 10
                },
                name: {
                    required: true
                },
                last_name: {
                    required: true
                },
                date_birth: {
                    required: true,
                    date: true
                },
                age: {
                    required: true,
                    number: true,
                    max: 15
                },
                genre: {
                    valueNotEquals: '? undefined:undefined ?',
                },
                address: {
                    required: true,
                    min: 10,
                },
                province: {
                    valueNotEquals: '?',
                },
                city: {
                    valueNotEquals: '?',
                },
                parish: {
                    valueNotEquals: '?',
                },
                physical_disability: {
                    valueNotEquals: '?',
                },
                intellectual_disability: {
                    valueNotEquals: '?',
                },
                visual_disability: {
                    valueNotEquals: '?',
                },
                psychosocial_disability: {
                    valueNotEquals: '?',
                },
                hearing_disability: {
                    valueNotEquals: '?',
                },
                conadis_id: {
                    required: true
                },
                grade_of_disability: {
                    valueNotEquals: '? undefined:undefined ?'
                },
                has_diagnostic: {
                    valueNotEquals: '? object:null ?'
                },
                diagnostic_id: {
                    valueNotEquals: '?'
                },
                entity_send_diagnostic: {
                    required: true
                },
                assist_other_therapeutic_center: {
                    valueNotEquals: '?'
                },
                therapeutic_center_name : {
                    required : function(){
                        return $scope.assist_other_therapeutic_center != '';
                    }
                }
            },
            messages: {
                num_identification: {
                    required: "Identificación requerida",
                    min: "Identificación inválida",
                    max: "Identificación inválida",
                },
                name: {
                    required: "Nombre Requerido"
                },
                last_name: {
                    required: "Apellido Requerido"
                },
                date_birth: {
                    required: "Fecha Nacimiento Requerida",
                    date: "La Fecha es Inválida",
                },
                age: {
                    required: "La Edad es Requerida",
                    number: true,
                    max: "Edad Incorrecta"
                },
                genre: {
                    valueNotEquals: 'Género requerido',
                },
                address: {
                    required: "Domicilio Requerida",
                    min: "Ingrese al menos 10 carácteres",
                },
                province: {
                    valueNotEquals: 'Provincia Requerida',
                },
                city: {
                    valueNotEquals: 'Ciudad Requerida',
                },
                parish: {
                    valueNotEquals: 'Parroquia Requerida',
                },
                physical_disability: {
                    valueNotEquals: 'D. Requerida',
                },
                intellectual_disability: {
                    valueNotEquals: 'D. Requerida',
                },
                visual_disability: {
                    valueNotEquals: 'D. Requerida',
                },
                hearing_disability: {
                    valueNotEquals: 'D. Requerida',
                },
                psychosocial_disability: {
                    valueNotEquals: 'D. Requerida',
                },
                conadis_id: {
                    required: "Conadis Requerida"
                },
                grade_of_disability: {
                    valueNotEquals: 'Es Requerido'
                }
            }
        }


        $scope.calculateAge = function(dateBirth) {
            $scope.model.age = pUserInscriptionService.calculateAge(dateBirth);
        };

        $scope.save = function(saveForm, returnIndex) {
            var successCallback = function() {
                $scope.saving = false;
                $scope.hasMessage = true;
                apiResource.resource('users').setOnCache(data);
                return true;
            }

            var failCallback = function() {
                $scope.saving = false
                return false;
            }
            if (saveForm.validate()) {
                $scope.saving = true;
                pUserInscriptionService.save($scope.model).then(successCallback, failCallback);
            }
        };

        $scope.delete = function(id) {
            apiResource.resource('puserinscriptions').getCopy(id).then(function(object) {
                var params = {
                    title: 'Atención',
                    text: 'Desea eliminar la Solicitud de ' + object.person.name + '.?'
                }
                $rootScope.openDelteModal(params).then(function() {
                    var idx = _.findIndex($scope.inscriptions, function(el) {
                        return el.id == object.id;
                    });
                    if (idx > -1) {
                        $scope.inscriptions[idx].$deleting = true;
                        object.$delete(function() {
                            pUserInscriptionService.messageFlag.title = "Rol eliminado correctamente";
                            pUserInscriptionService.messageFlag.type = "info";
                            $scope.messages = pUserInscriptionService.messageFlag;
                            $scope.hasMessage = true;
                            $scope.inscriptions[idx].$deleting = false;
                            $scope.inscriptions.splice(idx, 1);
                            apiResource.resource('puserinscriptions').removeFromCache(object.id);
                        })
                    }
                })
            });
        };




    }]);

    app.register.controller('pUserInscriptionEditCtrl', ['$scope', 'apiResource', '$stateParams', 'DTOptionsBuilder', 'pUserInscriptionService', function($scope, apiResource, $stateParams, DTOptionsBuilder, pUserInscriptionService) {

    }]);
});