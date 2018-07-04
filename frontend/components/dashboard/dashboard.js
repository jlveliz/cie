define(['app'], function(app) {


    app.register.controller('DashboardCtrl', ['$scope', 'envService', 'apiResource', '$rootScope', function($scope, envService, apiResource, $rootScope) {

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


        $scope.downloadRegistrationForm = function() {
            var params = {
                type: 'pdf',
                content: envService.read('public') + 'uploads/file/DOCS_FICHA_INSCRIPCION_min.pdf',
                title: 'Fichas de Inscripción'
            };
            $rootScope.openPreviewModal(params);
        }

    }]);

})