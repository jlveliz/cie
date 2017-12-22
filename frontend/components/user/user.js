/**
 ** User controller
 **/
define(['app'], function(app) {

    app.register.controller('UserIdxCtrl', ['$scope', 'apiResource', '$stateParams', 'DTOptionsBuilder', function($scope, apiResource, $stateParams, DTOptionsBuilder) {

        console.log(DTOptionsBuilder);
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
            $scope.loadingUsers = false;
            $scope.users = results;
        });

    }]);

});