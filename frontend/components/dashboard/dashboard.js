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
        };

        $scope.downloadBailoterapiaForm = function() {
            var params = {
                type: 'pdf',
                content: envService.read('public') + 'uploads/file/formato_bailoterapia.pdf',
                title: 'Formularios de Bailoterapia'
            };
            $rootScope.openPreviewModal(params);
        }

        $scope.downloadDeportesForm = function() {
            var params = {
                type: 'pdf',
                content: envService.read('public') + 'uploads/file/deporte_formatos.pdf',
                title: 'Formularios de Deportes'
            };
            $rootScope.openPreviewModal(params);
        }

        $scope.downloadHidroterapiaForm = function() {
            var params = {
                type: 'pdf',
                content: envService.read('public') + 'uploads/file/hidroterapia_forms.pdf',
                title: 'Formularios de Hidroterapia'
            };
            $rootScope.openPreviewModal(params);
        }
        
        $scope.downloadHorticulturaForm = function() {
            var params = {
                type: 'pdf',
                content: envService.read('public') + 'uploads/file/horticultura_forms.pdf',
                title: 'Formularios de Horticultura'
            };
            $rootScope.openPreviewModal(params);
        }

        $scope.downloadLenguajeForm = function() {
            var params = {
                type: 'pdf',
                content: envService.read('public') + 'uploads/file/lenguaje_forms.pdf',
                title: 'Formularios de Lenguaje'
            };
            $rootScope.openPreviewModal(params);
        }

     
        $scope.downloadMecanoterapiaForm = function() {
            var params = {
                type: 'pdf',
                content: envService.read('public') + 'uploads/file/mecanoterapia_forms.pdf',
                title: 'Formularios de Mecanoterapia'
            };
            $rootScope.openPreviewModal(params);
        }

        $scope.downloadMusicoterapiaForm = function() {
            var params = {
                type: 'pdf',
                content: envService.read('public') + 'uploads/file/musicoterapia_forms.pdf',
                title: 'Formularios de Musicoterapia'
            };
            $rootScope.openPreviewModal(params);
        }

        $scope.downloadOcupacionalForm = function() {
            var params = {
                type: 'pdf',
                content: envService.read('public') + 'uploads/file/ocupacional_forms.pdf',
                title: 'Formularios de Ocupacional'
            };
            $rootScope.openPreviewModal(params);
        }

        $scope.downloadPsicologiaForm = function() {
            var params = {
                type: 'pdf',
                content: envService.read('public') + 'uploads/file/psicologia_forms.pdf',
                title: 'Formularios de Psicología'
            };
            $rootScope.openPreviewModal(params);
        }

        $scope.downloadRecepcionForm = function() {
            var params = {
                type: 'pdf',
                content: envService.read('public') + 'uploads/file/recepcion_formatos.pdf',
                title: 'Formularios de Recepción'
            };
            $rootScope.openPreviewModal(params);
        }

    }]);

})