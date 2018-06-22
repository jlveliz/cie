define(['app'], function(app) {


    app.register.controller('DashboardCtrl', ['$scope', 'envService', 'apiResource', function($scope, envService, apiResource) {

        $scope.loading = true;

        //load all permissions 
        var req = {
            method: 'GET',
            url: envService.read('api') + 'dashboard'
        };


        apiResource.loadFromApi(req).then(function(dashboard) {
            $scope.totalUsersToday = dashboard.total_users_today;
            $scope.loading = false;
        });

    }]);

})