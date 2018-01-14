/**
 ** Inscriptions controller
 **/
define(['app'], function(app) {
    app.register.service('pUserInscriptionService', function() {

        var _this = this;
        _this.messageFlag = {};

    });

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
        }



    }]);

    app.register.controller('pUserInscriptionCreateCtrl', ['$scope', 'apiResource', '$stateParams', 'DTOptionsBuilder', 'pUserInscriptionService', function($scope, apiResource, $stateParams, DTOptionsBuilder, pUserInscriptionService) {

    }]); 

    app.register.controller('pUserInscriptionEditCtrl', ['$scope', 'apiResource', '$stateParams', 'DTOptionsBuilder', 'pUserInscriptionService', function($scope, apiResource, $stateParams, DTOptionsBuilder, pUserInscriptionService) {

    }]);
});