/**
 ** User controller
 **/
define(['app'], function(app) {

    app.register.controller('UserIdxCtrl', ['$scope', 'apiResource', '$stateParams', 'DTOptionsBuilder', function($scope, apiResource, $stateParams, DTOptionsBuilder) {

        $scope.users = [];
        $scope.loading = true;
        $scope.dtOptions = DTOptionsBuilder.newOptions().withBootstrap();

        angular.extend($scope.dtOptions, {
            orderable: false,
            columnDefs: [{
                orderable: false,
                targets: 4
            }],
            order: [
                [0, 'asc'],
                [1, 'asc'],
                [2, 'asc'],
                [3, 'asc'],
            ],
            responsive: true
        });

        apiResource.resource('users').query().then(function(results) {
            $scope.loading = false;
            $scope.users = results;
        });

    }]);

    app.register.controller('UserCreateCtrl', ['$scope', 'apiResource', '$stateParams', '$state', function($scope, apiResource, $stateParams, $state) {

        $scope.loading = true;
        $scope.model = {};
        $scope.listPermissions = [];
        $scope.messages = [];


        $scope.model = apiResource.resource('users').create();
        $scope.loading = false;

        $scope.validateOptions = {
            rules: {
                name: {
                    required: true,
                },
                password: {
                    required: true,
                },
                repeat_password: {
                    required: true,
                    equalTo: "#password"
                },
                username: {
                    required: true
                },
                last_name: {
                    required: true
                },
                email : {
                    required : true,
                    email: true,
                    unique: 'person,email'
                }
            },

            messages: {
                name: {
                    required: "Campo requerido",
                },
                repeat_password: {
                    required: "Campo requerido",
                    equalTo: "No coincide la contraseña"
                },
                password: {
                    required: "Campo requerido",
                },
                username: {
                    required: "Campo requerido"
                },
                last_name: {
                    required: "Campo requerido"
                },
                email : {
                    required : "Campo requerido",
                    email: "Email inválido",

                }
            }

        };

        $scope.save = function(form, returnIndex) {
          
            $scope.messages = {};
            if (form.validate()) {
                $scope.saving = true;
                $scope.model.$save(function(data) {
                    apiResource.resource('users').setOnCache(data);
                    if (returnIndex) {
                        $state.go('rootAdmin.generalBanners');
                    } else {
                        $state.go('rootAdmin.generalBanners.edit', {
                            userId: data.id
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

    }])


});