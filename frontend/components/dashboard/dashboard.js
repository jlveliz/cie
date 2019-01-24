define(['app'], function(app) {


    app.register.controller('DashboardCtrl', ['$scope', 'envService', 'apiResource', '$rootScope', '$state',function($scope, envService, apiResource, $rootScope, $state) {

        $scope.loading = true;

        //load all permissions 
        var req = {
            method: 'GET',
            url: envService.read('api') + 'dashboard'
        };


        apiResource.loadFromApi(req).then(function(dashboard) {
            $scope.totalUsersToday = dashboard.total_users_today;
            $scope.requestsForView = dashboard.requests_for_view;
            $scope.totalDates = dashboard.total_dates;
            $scope.loading = false;
        });


        $scope.downloadRegistrationForm = function() {
            var params = {
                type: 'pdf',
                content: envService.read('public') + 'uploads/file/DOCS_FICHA_INSCRIPCION_min.pdf',
                title: 'Fichas de Inscripción',
                permissions: { download: 'descargar_ficha_inscripcion', print: '' },
                role: 'admin'
            };
            $rootScope.openPreviewModal(params);
        };

        $scope.downloadBailoterapiaForm = function() {
            var params = {
                type: 'pdf',
                content: envService.read('public') + 'uploads/file/formato_bailoterapia.pdf',
                title: 'Formularios de Bailoterapia',
                permissions: { download: 'descargar_doc_terapias', print: '' },
                role: 'admin'
            };
            $rootScope.openPreviewModal(params);
        }

        $scope.downloadDeportesForm = function() {
            var params = {
                type: 'pdf',
                content: envService.read('public') + 'uploads/file/deporte_formatos.pdf',
                title: 'Formularios de Deportes',
                permissions: { download: 'descargar_doc_terapias', print: '' },
                role: 'admin'
            };
            $rootScope.openPreviewModal(params);
        }

        $scope.downloadHidroterapiaForm = function() {
            var params = {
                type: 'pdf',
                content: envService.read('public') + 'uploads/file/hidroterapia_forms.pdf',
                title: 'Formularios de Hidroterapia',
                permissions: { download: 'descargar_doc_terapias' , print: '' },
                role: 'admin' 
            };
            $rootScope.openPreviewModal(params);
        }

        $scope.downloadHorticulturaForm = function() {
            var params = {
                type: 'pdf',
                content: envService.read('public') + 'uploads/file/horticultura_forms.pdf',
                title: 'Formularios de Horticultura',
                permissions: { download: 'descargar_doc_terapias' , print: '' },
                role: 'admin' 
            };
            $rootScope.openPreviewModal(params);
        }

        $scope.downloadLenguajeForm = function() {
            var params = {
                type: 'pdf',
                content: envService.read('public') + 'uploads/file/lenguaje_forms.pdf',
                title: 'Formularios de Lenguaje',
                permissions: { download: 'descargar_doc_terapias' , print: '' },
                role: 'admin' 
            };
            $rootScope.openPreviewModal(params);
        }


        $scope.downloadMecanoterapiaForm = function() {
            var params = {
                type: 'pdf',
                content: envService.read('public') + 'uploads/file/mecanoterapia_forms.pdf',
                title: 'Formularios de Mecanoterapia',
                permissions: { download: 'descargar_doc_terapias' , print: '' },
                role: 'admin' 
            };
            $rootScope.openPreviewModal(params);
        }

        $scope.downloadMusicoterapiaForm = function() {
            var params = {
                type: 'pdf',
                content: envService.read('public') + 'uploads/file/musicoterapia_forms.pdf',
                title: 'Formularios de Musicoterapia',
                permissions: { download: 'descargar_doc_terapias' , print: '' },
                role: 'admin' 
            };
            $rootScope.openPreviewModal(params);
        }

        $scope.downloadOcupacionalForm = function() {
            var params = {
                type: 'pdf',
                content: envService.read('public') + 'uploads/file/ocupacional_forms.pdf',
                title: 'Formularios de Ocupacional',
                permissions: { download: 'descargar_doc_terapias' , print: '' },
                role: 'admin' 
            };
            $rootScope.openPreviewModal(params);
        }

        $scope.downloadPsicologiaForm = function() {
            var params = {
                type: 'pdf',
                content: envService.read('public') + 'uploads/file/psicologia_forms.pdf',
                title: 'Formularios de Psicología',
                permissions: { download: 'descargar_doc_terapias' , print: '' },
                role: 'admin' 
            };
            $rootScope.openPreviewModal(params);
        }

        $scope.downloadRecepcionForm = function() {
            var params = {
                type: 'pdf',
                content: envService.read('public') + 'uploads/file/recepcion_formatos.pdf',
                title: 'Formularios de Recepción',
                permissions: { download: 'descargar_recepcion', print: '' },
                role: 'admin'
            };
            $rootScope.openPreviewModal(params);
        }

        $scope.gotRequest = function() {
            $state.go('root.requests');
        }

    }]);

})