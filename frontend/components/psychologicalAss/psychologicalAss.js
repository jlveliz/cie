/**
	EVALICACIÓN PSICOLÓGICA	
**/

define(['app'], (app) => {

    app.register.service('PshychoService', function() {
        var _this = this;
        _this.messageFlag = {};
    });

    app.register.controller('PsychologicalAssIdxCtrl', ['$scope', 'apiResource', 'DTOptionsBuilder', 'PshychoService', function($scope, apiResource, DTOptionsBuilder, PshychoService) {

        $scope.models = [];
        $scope.loading = true;
        $scope.dtOptions = DTOptionsBuilder.newOptions().withBootstrap();
        $scope.messages = {};
        $scope.hasMessage = false;

        angular.extend($scope.dtOptions, {
            orderable: false,
            columnDefs: [{
                orderable: false,
                targets: 2
            }],
            order: [
                [0, 'asc'],
                [1, 'asc'],
            ],
            responsive: true,
        });

        apiResource.resource('psycho-assessments').query().then(function(results) {
            $scope.loading = false;
            $scope.models = results;
            $scope.messages = PshychoService.messageFlag;
            if (!_.isEmpty($scope.messages)) {
                $scope.hasMessage = true;
                PshychoService.messageFlag = {};
            }
        });

        $scope.delete = function(id) {
            apiResource.resource('psycho-assessments').getCopy(id).then(function(object) {
                var params = {
                    title: 'Atención',
                    text: 'Desea eliminar la Evaluación de ' + object.user.name + ' ' + object.user.last_name + '.?'
                }
                $rootScope.openDeleteModal(params).then(function() {
                    var idx = _.findIndex($scope.models, function(el) {
                        return el.id == object.id;
                    });
                    if (idx > -1) {
                        $scope.models[idx].$deleting = true;
                        object.$delete(function() {
                            PshychoService.messageFlag.title = "Evaluación eliminada correctamente";
                            PshychoService.messageFlag.type = "info";
                            $scope.messages = PshychoService.messageFlag;
                            $scope.hasMessage = true;
                            $scope.models[idx].$deleting = false;
                            $scope.models.splice(idx, 1);
                            apiResource.resource('psycho-assessments').removeFromCache(object.id);
                        })
                    }
                })
            });
        };


    }]);

    app.register.controller('PsychologicalAssCreateCtrl', ['$scope', function($scope) {
        console.log('entra')
    }]);

    app.register.controller('PsychologicalAssEditCtrl', ['$scope', function($scope) {

    }]);

});