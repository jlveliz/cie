/**
 ** Auth controller
 **/
define(['app'], function(app) {
    console.log(app)
    app.controller('LoginCtrl', ['$scope', 'authFactory', '$state', function($scope, authFactory, $state) {

        $scope.auth = {};
        $scope.loading = false;
        $scope.existError = false;
        $scope.messages = {};


        $scope.validationOptions = {
            rules: {
                username: {
                    required: true
                },
                password: {
                    required: true
                }
            },
            messages: {
                username: {
                    required: "Usuario requerido"
                },
                password: {
                    required: "Contraseña requerida"
                }
            }
        };


        $scope.login = function(form) {
            if (form.validate()) {
                $scope.loading = true;
                var credentials = {
                    username: $scope.auth.username,
                    password: $scope.auth.password
                }
                authFactory.login(credentials).then(function(success) {
                        $scope.loading = false;
                        $state.go('rootAdmin.dashboard');
                    },
                    function(reason) {
                        $scope.loading = false;
                        $scope.existError = true;
                        $scope.messages.title = reason.data.message;
                        $scope.messages.detail = reason.data.detail;
                        $scope.auth.password = null;

                    });

            }
        }

    }]);

});
