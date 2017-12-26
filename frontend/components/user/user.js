/**
 ** User controller
 **/
define(['app'], function(app) {

    app.register.service('UserService', function() {

        var _this = this;

        _this.messageFlag = {};
    })

    app.register.controller('UserIdxCtrl', ['$scope', 'apiResource', '$stateParams', 'DTOptionsBuilder', 'UserService', function($scope, apiResource, $stateParams, DTOptionsBuilder, UserService) {

        $scope.users = [];
        $scope.loading = true;
        $scope.dtOptions = DTOptionsBuilder.newOptions().withBootstrap();
        $scope.messages = {};
        $scope.hasMessage = false;

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
            $scope.messages = UserService.messageFlag;
            if (!_.isEmpty($scope.messages)) {
                $scope.hasMessage = true;
                UserService.messageFlag = {};
            }
        });

    }]);

    app.register.controller('UserCreateCtrl', ['$scope', 'apiResource', '$stateParams', '$state', 'UserService', function($scope, apiResource, $stateParams, $state, UserService) {

        $scope.saving = false;
        $scope.model = {};
        $scope.listPermissions = [];
        $scope.messages = [];


        $scope.model = apiResource.resource('users').create();

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
                    required: true,
                    unique: 'user,username'
                },
                last_name: {
                    required: true
                },
                email: {
                    required: true,
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
                    required: "Campo requerido",
                    unique: 'El usuario ya fue tomado'
                },
                last_name: {
                    required: "Campo requerido"
                },
                email: {
                    required: "Campo requerido",
                    email: "Email inválido",
                    unique: 'El Correo ya fue tomado'

                }
            }

        };

        $scope.save = function(form, returnIndex) {
            $scope.messages = {};
            if (form.validate()) {
                debugger;
                $scope.saving = true;
                $scope.model.$save(function(data) {
                    apiResource.resource('users').setOnCache(data);
                    UserService.messageFlag.title = "Usuario creado correctamente";
                    UserService.messageFlag.type = "info";
                    if (returnIndex) {
                        $state.go('root.user');
                    } else {
                        $state.go('root.user.edit', {
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

    }]);

    app.register.controller('UserEditCtrl', ['$scope', 'apiResource', '$stateParams', '$state', 'UserService', function($scope, apiResource, $stateParams, $state, UserService) {

        var userId = $stateParams.userId;

        $scope.loading = true;
        $scope.model = {};
        $scope.messages = {};
        $scope.existError = false;

        apiResource.resource('users').getCopy(userId).then(function(model) {
            $scope.model = model;
            $scope.model.name = $scope.model.person.name;
            $scope.model.last_name = $scope.model.person.last_name;
            $scope.model.email = $scope.model.person.email;
            $scope.messages = UserService.messageFlag;
            if (!_.isEmpty($scope.messages)) {
                $scope.hasMessage = true;
                UserService.messageFlag = {};
            }
            $scope.loading = false;
        });

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
                    required: true,
                    unique: 'user,username'
                },
                last_name: {
                    required: true
                },
                email: {
                    required: true,
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
                email: {
                    required: "Campo requerido",
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
                    UserService.messageFlag.title = "Usuario creado correctamente";
                    UserService.messageFlag.type = "info";
                    if (returnIndex) {
                        $state.go('root.user');
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