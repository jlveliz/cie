/*
    Request Module
*/
define(['app', 'moment'], function(app, moment) {

    app.register.service('RequestService', ['$q', 'apiResource', 'envService', function($q, apiResource, envService) {

        var _this = this;
        _this.messageFlag = {};

        _this.representantTypes = [];

        _this.tabActive = 0;

        _this.setTab = function(numTab) {
            _this.tabActive = numTab;
        }

        _this.getTab = function() {
            return _this.tabActive;
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
        }


        _this.createPatientUserStructure = function(model) {
            var deferred = $q.defer();

            var pUser = apiResource.resource('puserinscriptions').create({
                num_identification: model.num_identification_patient,
                name: model.name_patient,
                last_name: model.last_name_patient,
                state: 2,
                date_admission: moment(model.date_admission).format('YYYY-MM-DD'),
                schooling: 3
            });

            var found = _.findWhere(_this.representantTypes, { idparameter: model.representant_type.toString() });
            if (found) {

                if (model.representant_type == 1) {
                    pUser.has_father = 1;
                    pUser.father = {
                        name: model.name_representant,
                        last_name: model.last_name_representant,
                        num_identification: model.num_identification_representant,
                        email: model.email,
                        phone: model.telephone,
                        is_representant: 1
                    };
                } else if (model.representant_type == 2) {
                    pUser.has_mother = 1;
                    pUser.mother = {
                        name: model.name_representant,
                        last_name: model.last_name_representant,
                        num_identification: model.num_identification_representant,
                        email: model.email,
                        phone: model.telephone,
                        is_representant: 1
                    };
                } else {
                    pUser.has_father = 0;
                    pUser.has_mother = 0;
                    pUser.representant = {
                        name: model.name_representant,
                        last_name: model.last_name_representant,
                        num_identification: model.num_identification_representant,
                        email: model.email,
                        phone: model.telephone,
                        is_representant: true
                    };

                }

                deferred.resolve(pUser);

            } else {
                deferred.reject('no se pudo encontrar representante');
            }

            return deferred.promise

        };

        _this.validateIfExistPatientUser = function(numIdentification) {
            var deferred = $q.defer();

            let urlGet = envService.read('api') + 'validator/uniquePatient?columnname=num_identification&value=' + numIdentification;
            // if (id) urlGet += '&id=' + id;

            $.ajax({
                url: urlGet,
                type: 'GET',
                async: false,
                success: function(result) {
                    success = result === "ok" ? true : false;
                    if (success)
                        deferred.resolve(success);
                    else
                        deferred.reject(success);

                }

            });
            return deferred.promise;
        }


    }]);


    //Controller
    app.register.controller('RequestIdxCtrl', ['$scope', 'apiResource', 'RequestService', '$stateParams', function($scope, apiResource, RequestService, $stateParams) {

        $scope.tabActive = RequestService.getTab() || 0;

        $scope.loading = true;
        $scope.messages = {};
        $scope.models = [];
        $scope.hasMessage = false;
        $scope.currentPage = 1;
        $scope.totalItems = null;

        var loadList = (num) => {
            apiResource.resource('requests').paginate(num).then(function(results) {
                $scope.loading = false;
                $scope.models = results.data;
                $scope.totalItems = results.total;
                $scope.maxSize = 5;

                $scope.messages = RequestService.messageFlag;
                if (!_.isEmpty($scope.messages)) {
                    $scope.hasMessage = true;
                    RequestService.messageFlag = {};
                }
            });
        };

        loadList();


        $scope.changePage = (num) => {
            loadList(num);
        };

    }]);


    // SHOW CONTROLLER
    app.register.controller('ShowCtrl', ['$scope', '$stateParams', 'apiResource', '$state', 'RequestService', '$q', 'envService', function($scope, $stateParams, apiResource, $state, RequestService, $q, envService) {

        $scope.loading = true;
        $scope.messages = {};
        $scope.existError = false;
        $scope.hasMessage = false;
        $scope.model = {

        };
        let requestId = $stateParams.requestId;

        var reqKeyParameter = {
            method: 'GET',
            url: envService.read('api') + 'load-parameter/REPRESENTANT_TYPE'
        };

        var deps = $q.all([
            apiResource.loadFromApi(reqKeyParameter).then(function(result) {
                RequestService.representantTypes = result;
            })
        ])


        deps.then(function() {
            apiResource.resource('requests').getCopy({ id: requestId, noCache: true }).then(
                function(result) {
                    $scope.model = result;

                    RequestService.validateIfExistPatientUser($scope.model.num_identification_patient).then(
                        function(result) {
                        },
                        function(exist) {
                            $scope.existError = true;
                            $scope.messages.title = "Ya existe una ficha de inscripción vigente";
                            $scope.hasMessage = true;
                        })


                    if ($scope.model.begin_date) {
                        $scope.model.begin_date = new Date($scope.model.begin_date)
                    } else {
                        $scope.model.begin_date = new Date()
                    }

                    if ($scope.model.end_date) {
                        $scope.model.end_date = new Date($scope.model.end_date)
                    } else {
                        $scope.model.end_date = new Date()
                    }

                    $scope.loading = false;
                },
                function(err) {

                }
            );
        })



        $scope.goListIngresadas = function() {
            RequestService.setTab(0);
            $state.go('root.requests')
        }

        $scope.goListCitasAgendadas = function() {
            RequestService.setTab(1);
            $state.go('root.requests')
        }

        $scope.saveAndClose = function(saveForm) {

            var successCallback = function(data) {
                $scope.saving = false;
                $scope.hasMessage = true;
                apiResource.resource('requests').setOnCache(data);
                RequestService.messageFlag.title = "Solicitud de  " + $scope.model.name_representant + ' ' + $scope.model.name_representant + " ha sido agendada Correctamente";
                RequestService.messageFlag.type = "info";
                $scope.messages = RequestService.messageFlag;
                $state.go('root.requests');

            }

            var failCallback = function(reason) {
                $scope.saving = false
                $scope.existError = true;
                $scope.messages.title = reason.data.title;
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
                $scope.model.status = "A";
                $scope.model.end_date = moment($scope.model.end_date).format('YYYY-MM-DD HH:mm');
                RequestService.save($scope.model).then(successCallback, failCallback);
            }
        }

        $scope.validateOptions = {
            rules: {
                num_identification: {
                    uniquePatient: 'num_identification'
                }
            },
            messages: {
                num_identification: {
                    uniquePatient: 'Ya existe un usuario registrado'
                }
            }
        }


        $scope.createPatientUser = function(saveForm) {
            if (saveForm.validate()) {
                $scope.saving = true;
                $scope.end_date = moment($scope.end_date).format('YYYY-MM-DD HH:mm');
                $scope.model.$update(requestId).then(function() {
                    $scope.model.status = "D";
                    RequestService.createPatientUserStructure($scope.model).then(function(pUser) {
                        pUser.$save().then(function(model) {
                            $state.go('root.inscription.edit', {
                                pInsId: model.id
                            })
                            $scope.saving = false;
                        });
                    });
                })
                $scope.patienUser = apiResource.resource('puserinscriptions').create({
                    num_identification: $scope.model.num_identification_patient,
                    name: $scope.model.name_patient,
                    last_name: $scope.model.last_name_patient,
                    state: 2,
                    has_mother: 0,
                    has_father: 0,
                    representant: {
                        name: $scope.model.name_representant,
                        last_name: $scope.model.last_name_representant,
                        num_identification: $scope.model.num_identification_representant,
                        email: $scope.model.email,
                        phone: $scope.model.telephone
                    },
                });


            }
        }

    }]);


})