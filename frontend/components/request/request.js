/*
    Request Module
*/
define(['app','moment'],function(app,moment){

    app.register.service('RequestService', ['$q', function($q) { 

        var _this = this;
        _this.messageFlag = {};

        _this.save = function(model) {

            var deferred = $q.defer();

            var successCallback = function(model) {
                deferred.resolve(model);
            }

            var failCallback = function(error) {
                deferred.reject(error);
            }

            if (model.id) {
                model.$update(model.id, successCallback, failCallback);
            } else {
                model.$save(successCallback, failCallback);
            }

            return deferred.promise;
        }


    }]);


    //Controller
    app.register.controller('RequestIdxCtrl',['$scope', 'apiResource','RequestService',function($scope,apiResource,RequestService){


        $scope.loading = true;
        $scope.messages = {};
        $scope.models = [];
        $scope.hasMessage = false;
        $scope.currentPage = 1;
        $scope.totalItems = null;

        var loadList = (num) => {
            apiResource.resource('requests').paginate(num).then(function(results) {
                $scope.loading = false;
                $scope.models = results.data;
                $scope.totalItems = results.total;
                $scope.maxSize = 5;

                $scope.messages = RequestService.messageFlag;
                if (!_.isEmpty($scope.messages)) {
                    $scope.hasMessage = true;
                    RequestService.messageFlag = {};
                }
            });
        };

        loadList();


        $scope.changePage = (num) => {
            loadList(num);
        };

    }]);


    // SHOW CONTROLLER
    app.register.controller('ShowCtrl',['$scope','$stateParams','apiResource',function($scope,$stateParams,apiResource) {

        $scope.loading = true;
        $scope.messages = {};
        $scope.model = {};
        let requestId = $stateParams.requestId;

        apiResource.resource('requests').getCopy({ id: requestId, noCache: true }).then(
            function(result) {
                console.log(result)
                $scope.model = result;
            },
            function(err) {

            }
        )

    }]);


})