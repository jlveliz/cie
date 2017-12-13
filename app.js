"use strict";

define([
    'angularAMD',
    'angular',
    'angular-ui-router',
    'angular-resource',
    'angular-ui-router-styles'

], function(angularAMD) {

    var cie = angular.module('cieApp', ['ui.router', 'ngResource', 'uiRouterStyles']);

    cie.constant('appName', 'CIE');

    cie.provider('apiResource', function() {
        return {
            $get: ['$resource', "$q", '$cacheFactory', '$http', function($resource, $q, $cacheFactory, $http) {
                var names = {};
                var caching = $cacheFactory('novaTickets');
                var getFromCache = function(idCache) {
                    var existCache = caching.get(idCache);
                    if (existCache) return existCache;
                    return null;
                }
                var formDataObject = function(data) {
                    var formData = new FormData();
                    for (i in data) {
                        if (i.indexOf('$') == -1) {
                            formData.append(i, data[i]);
                            // if (angular.isArray(data[i])) {
                            //     formDataObject(data[i])
                            // }
                        }
                    }
                    return formData;
                }

                return {

                    formDataObject: formDataObject,

                    clearAllCache: function() {
                        return caching.removeAll();
                    },
                    resource: function(nameResource, url, paramDefaults, customActions) {
                        var resource = {
                            register: function() {
                                if (!$.isEmptyObject(names)) {
                                    for (name in names) {
                                        if (name == nameResource) {
                                            throw "Ya existe el recurso " + nameResource;
                                        } else {
                                            names[nameResource] = {};
                                        }
                                    }
                                } else {
                                    names[nameResource] = {};
                                }

                                var defaultActions = {
                                    query: {
                                        method: "GET",
                                    },
                                    update: {
                                        method: "PUT",
                                        // transformRequest: formDataObject,
                                        // headers: {
                                        //     'Content-Type': undefined,
                                        //     'enctype': 'multipart/form-data'
                                        // }
                                    },
                                    save: {
                                        method: "POST",
                                        // transformRequest: formDataObject,
                                        // headers: {
                                        //     'Content-Type': undefined,
                                        //     'enctype': 'multipart/form-data'
                                        // }
                                    },
                                    get: {
                                        method: "GET",
                                    },
                                    delete: {
                                        method: "DELETE",
                                    }
                                };

                                if (!customActions) customActions = {};
                                angular.extend(defaultActions, customActions);
                                names[nameResource] = $resource(url, paramDefaults, defaultActions);
                            },
                            create: function(data) {
                                if (names[nameResource]) {
                                    return new names[nameResource](data);
                                }
                                throw "Recurso " + nameResource + " no existe";
                            },
                            query: function(params) {
                                var _this = this;
                                var deferred = $q.defer();
                                var r = _this.create();
                                var keyCache = nameResource;
                                //if nested resource
                                if (params && params.parentId) {
                                    keyCache += '/' + params.parentId;
                                }

                                var existOnCache = getFromCache(keyCache);
                                if (existOnCache) {
                                    deferred.resolve(existOnCache);
                                    return deferred.promise;
                                }

                                r.$query(params).then(function(result) {
                                    // create resource item
                                    var resources = [];
                                    angular.forEach(result.data, function(item) {
                                        var newResource = _this.create(item);
                                        resources.push(newResource);
                                    });
                                    //set on cache list array
                                    _this.setOnCache(resources, params && params.parentId ? params.parentId : null);
                                    result.data = resources;
                                    deferred.resolve(result.data)
                                }, function(error) {
                                    deferred.reject(error)
                                });
                                return deferred.promise;
                            },
                            queryCopy: function(params) {
                                var deferred = $q.defer();
                                var copy = [];
                                this.query(params).then(function(result) {
                                    copy = angular.copy(result);
                                    deferred.resolve(copy);
                                })
                                return deferred.promise;
                            },
                            get: function(params) {
                                var param = angular.isObject(params) ? params : {
                                    id: params
                                };
                                var deferred = $q.defer();
                                var r = this.create();
                                var _this = this;
                                //exist in cache ?
                                var keyCache = nameResource;
                                if (params && params.parentId) {
                                    keyCache += '/' + params.parentId;
                                }
                                var arrayCache = getFromCache(keyCache);
                                if (arrayCache && arrayCache.length > 0) {
                                    var idxArray = _.findIndex(arrayCache, function(item) {
                                        return item.id == param.id;
                                    });
                                    if (idxArray > -1) {
                                        deferred.resolve(arrayCache[idxArray]);
                                        return deferred.promise;
                                    }
                                }
                                r.$get(param).then(function(result) {
                                    _this.setOnCache(result, params && params.parentId ? params.parentId : null)
                                    deferred.resolve(result);
                                }, function(error) {
                                    deferred.reject(error)
                                })
                                return deferred.promise;
                            },
                            getCopy: function(params) {
                                var param = angular.isObject(params) ? param : {
                                    id: params
                                };
                                var deferred = $q.defer();
                                var copy = {};
                                this.get(param).then(function(result) {
                                    copy = angular.copy(result);
                                    deferred.resolve(copy);
                                })
                                return deferred.promise;
                            },
                            setOnCache: function(params, isNested) {
                                var idCookie = nameResource;
                                if (isNested) idCookie += '/' + isNested;
                                if (!names[nameResource]) {
                                    throw "Recurso " + nameResource + " no existe";
                                }

                                //CACHING
                                if (angular.isArray(params)) {
                                    caching.put(idCookie, params); //set cache new resource
                                } else if (angular.isObject(params)) {
                                    var arrayCache = getFromCache(idCookie);
                                    if (arrayCache) {
                                        var idxArray = _.findIndex(arrayCache, function(item) {
                                            return item.id == params.id;
                                        });
                                        if (idxArray > -1) {
                                            arrayCache[idxArray] = params;
                                        } else {
                                            arrayCache.push(params);
                                        }
                                    }
                                }
                            },
                            removeFromCache: function(itemId, isNested) {
                                var idCookie = nameResource;
                                if (isNested) idCookie += '/' + isNested;
                                if (!names[nameResource]) {
                                    throw "Recurso " + nameResource + " no existe";
                                }
                                var arrayCache = getFromCache(idCookie);
                                if (arrayCache) {
                                    var idxArray = _.findIndex(arrayCache, function(item) {
                                        return item.id == itemId;
                                    });
                                    if (idxArray > -1) arrayCache.splice(idxArray, 1);
                                }
                            },
                            persistCollections: function(parent, collections) {
                                var parent = angular.isObject(parent) ? parent : {
                                    parentId: parent
                                };
                                if (!angular.isArray(collections)) throw "Se espera un arreglo de recursos";
                                if (!names[nameResource]) {
                                    throw "Recurso " + nameResource + " no existe";
                                }
                                var deferred = $q.defer();
                                var _this = this;
                                var keyCache = nameResource + '/' + parent.parentId;
                                var arrayCache = angular.copy(getFromCache(keyCache), []);
                                var rPersist = {
                                    insert: [],
                                    update: [],
                                    delete: [],
                                };
                                angular.forEach(collections, function(itemCollection) { // to insert
                                    //to insert
                                    if (!itemCollection.id) {
                                        rPersist.insert.push(itemCollection);
                                    } else {
                                        //to update
                                        var found = _.findWhere(arrayCache, {
                                            id: itemCollection.id
                                        });
                                        if (found && !angular.equals(found, itemCollection)) {
                                            rPersist.update.push(itemCollection);
                                        }
                                    }
                                })
                                if (arrayCache.length) {
                                    angular.forEach(arrayCache, function(itemCache, index) {
                                        var found = _.findWhere(collections, {
                                            id: itemCache.id
                                        })
                                        if (!found) {
                                            rPersist.delete.push(itemCache);
                                        }
                                    })
                                }
                                var resultActions = [];
                                angular.forEach(rPersist.insert, function(itemInsert) {
                                    resultActions.push(itemInsert.$save(parent, function(result) {
                                        _this.setOnCache(result, parent.parentId);
                                    }, function(error) {
                                        deferred.reject(error);
                                    }));
                                })
                                angular.forEach(rPersist.update, function(itemUpdate) {
                                    resultActions.push(itemUpdate.$update(function(result) {
                                        _this.setOnCache(result, parent.parentId);
                                    }, function(error) {
                                        deferred.reject(error);
                                    }));
                                });
                                angular.forEach(rPersist.delete, function(itemDelete) {
                                    resultActions.push(itemDelete.$delete(function(result) {
                                        _this.removeFromCache(result.item, parent.parentId);
                                    }, function(error) {
                                        deferred.reject(error);
                                    }));
                                });
                                //wait resolve all actions
                                $q.all(resultActions).then(function() {
                                    var resolved = {
                                        inserted: rPersist.insert.length,
                                        updated: rPersist.update.length,
                                        deleted: rPersist.delete.length
                                    }
                                    deferred.resolve(resolved);
                                }, function() {
                                    deferred.reject();
                                })
                                return deferred.promise;
                            },
                        };
                        return resource;

                    },
                    loadFromApi: function(req) {
                        var _this = this;
                        var deferred = $q.defer();
                        $http(req).then(function(result) {
                            deferred.resolve(result.data);
                        }, function(error) {
                            deferred.reject(error)
                        })
                        return deferred.promise;
                    }
                }


            }]
        }
    });


    cie.directive('title', ['$rootScope', '$timeout',
        function($rootScope, $timeout) {
            return {
                link: function() {
                    $rootScope.title = "Ingreso";
                    var listener = function(event, toState) {
                        $timeout(function() {
                            $rootScope.title = (toState.data && toState.data.pageTitle) ? toState.data.pageTitle : 'Default title';
                        });
                    };

                    $rootScope.$on('$stateChangeSuccess', listener);
                }
            };
        }
    ]);

    cie.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', function($stateProvider, $locationProvider, $urlRouterProvider) {

        $locationProvider.html5Mode(true);

        $urlRouterProvider.otherwise('/admin/errors/404');

        $stateProvider.state('adminAuth', angularAMD.route({
            url: '/',
            controllerUrl: 'frontend/components/auth/auth',
            views: {
                "@": {
                    templateUrl: "frontend/components/auth/login.html",
                    controller: 'LoginCtrl'
                }
            },
            data: {
                css: ['frontend/assets/css/login.css'],
                // permissions: {
                //     except: ['isloggedin'],
                //     // redirectTo: "rootAdmin.dashboard"
                // },
                pageTitle: "Ingreso"
            }
        }));

        $stateProvider.state('errorsAdmin.404', angularAMD.route({
            url: '/404',
            templateUrl: "frontend/components/errors/404.html",
            data: {
                pageTitle: "No encontrado"
            }
        }));
    }]);

    cie.run(['appName', '$rootScope', function(appName, $rootScope) {

    	$rootScope.appname = appName;

    }]);

    angularAMD.bootstrap(cie);

    return cie;

});