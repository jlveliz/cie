/*
    Request Module
*/
define(['app','moment'],function(app,moment){

    app.register.service('RequestService', ['$q', function($q) { 

        var _this = this;
        _this.messageFlag = {};

        _this.tabActive = 0;

        _this.setTab = function(numTab){
            _this.tabActive = numTab;
        }

        _this.getTab = function() {
            return _this.tabActive;
        }

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
    app.register.controller('RequestIdxCtrl',['$scope', 'apiResource','RequestService','$stateParams',function($scope,apiResource,RequestService,$stateParams){
       
        $scope.tabActive = RequestService.getTab() || 0;

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
    app.register.controller('ShowCtrl',['$scope','$stateParams','apiResource','$state','RequestService',function($scope,$stateParams,apiResource, $state,RequestService) {

        $scope.loading = true;
        $scope.messages = {};
        $scope.existError = false;
        $scope.model = {
            
        };
        let requestId = $stateParams.requestId;

        apiResource.resource('requests').getCopy({ id: requestId, noCache: true }).then(
            function(result) {
                $scope.model = result;
                if($scope.model.begin_date) {
                    $scope.model.begin_date = new Date($scope.model.begin_date)
                } else {
                    $scope.model.begin_date = new Date()
                }
                
                if($scope.model.begin_date) {
                    $scope.model.end_date = new Date($scope.model.end_date)
                }else {
                    $scope.model.end_date = new Date()
                }
                
                $scope.loading = false;
            },
            function(err) {

            }
        );

       
        $scope.goListIngresadas = function() {
            RequestService.setTab(0);
            $state.go('root.requests')
        }
       
        $scope.goListCitasAgendadas = function() {
            RequestService.setTab(1);
            $state.go('root.requests')
        }

        $scope.saveAndClose = function(saveForm){

            var successCallback = function(data) {
                $scope.saving = false;
                $scope.hasMessage = true;
                apiResource.resource('requests').setOnCache(data);
                RequestService.messageFlag.title = "Solicitud de  " + $scope.model.name_representant + ' ' + $scope.model.name_representant + " ha sido agendada Correctamente";
                RequestService.messageFlag.type = "info";
                $scope.messages = RequestService.messageFlag;
                $state.go('root.requests');
                
            }

            var failCallback = function(reason) {
                $scope.saving = false
                $scope.existError = true;
                $scope.messages.title = reason.data.title;
                $scope.messages.details = [];
                var json = JSON.parse(reason.data.detail);
                angular.forEach(json, function(elem, idx) {
                    angular.forEach(elem, function(el, idex) {
                        $scope.messages.details.push(el)
                    })
                })
            }

            if (saveForm.validate()) {
                debugger;
                $scope.saving = true;
                $scope.model.status ="A";
                RequestService.save($scope.model).then(successCallback, failCallback);
            }
        }

    }]);


})