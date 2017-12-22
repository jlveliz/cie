"use strict";

define([
    'angularAMD',
    'angular',
    'angular-ui-router',
    'angular-resource',
    'angular-ui-router-styles',
    'satellizer',
    'angular-environments',
    'angular-validation',
    'angular-permission',
    'bootstrap',
    'angular-datatables',
    'angular-bootstrap',
], function(angularAMD) {

    var cie = angular.module('cieApp', ['ui.router', 'ngResource', 'uiRouterStyles', 'satellizer', 'environment', 'ngValidate', 'permission', 'datatables', 'ui.bootstrap', ]);

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

    cie.factory('authFactory', ['$auth', '$http', 'envService', 'PermissionStore', '$q', '$rootScope', function($auth, $http, envService, PermissionStore, $q, $rootScope) {
        return {
            login: function(credentials) {
                var deferred = $q.defer();
                $auth.login(credentials).then(function(success) {
                    $http.get(envService.read('api') + 'authenticate/verify').then(function(response) {
                        var user = JSON.stringify(response.data);
                        localStorage.setItem('user', user);
                        $rootScope.currentUser = response.data;
                        deferred.resolve();
                    });
                }, function(reason) {
                    deferred.reject(reason);
                });
                return deferred.promise;
            },
            logout: function() {
                var deferred = $q.defer();
                $auth.logout().then(function() {
                    // RoleStore.clearStore(); //remove roles from user
                    localStorage.removeItem('user');
                    $rootScope.currentUser = null;
                    deferred.resolve();
                });
                return deferred.promise;
            },
            authenticated: function() {
                if ($auth.isAuthenticated()) {
                    return true;
                } else {
                    localStorage.removeItem('user');
                    $rootScope.currentUser = null;
                    return false;
                }
            },
            refreshToken: function() {
                var deferred = $q.defer();
                $http.get(envService.read('api') + 'authenticate/refresh').then(function(response) {
                    $auth.setToken(response.data.token)
                    deferred.resolve();
                }, function(reason) {
                    deferred.reject(reason);
                });
                return deferred.promise;
            },
            verify: function() {
                var deferred = $q.defer();
                $http.get(envService.read('api') + 'authenticate/verify')
                    .then(function(success) {
                        deferred.resolve(success)
                    }, function(error) {
                        deferred.reject(error)
                    });
                return deferred.promise;
            }
        };
    }])

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

    cie.directive('backendMenu', ['$state', function($state) {
        return {
            restrict: 'E',
            templateUrl: "frontend/partials/nav.html",
            link: function(scope, iElement, iAttrs) {

                scope.navElements = [{
                    section: 'General',
                    navEls: [{
                        label: 'Inicio',
                        icon: 'fa-home',
                        desc: 'Inicio de la administración',
                        sref: 'root.dashboard',
                    }]
                }, {
                    section: 'Configuración',
                    navEls: [{
                        label: 'Usuarios',
                        icon: 'fa-users',
                        desc: 'Usuarios',
                        sref: 'root.user',
                    }]
                }];

                var elem = $(iElement);
                elem.on('click', 'a', function(event) {

                    $('ul.side-menu li').each(function(index, el) {
                        var $el = $(el);
                        if ($el.hasClass('active') && $el.hasClass('has-childs')) {
                            $('ul:first', $el).slideUp();
                            $el.removeClass('active')
                        } else {
                            $el.removeClass('active')
                        }
                    });

                    var $liparent = $(this).parent();
                    if ($liparent.hasClass('has-childs')) {
                        if ($liparent.hasClass('active') && $el.hasClass('has-childs')) {
                            $liparent.removeClass('active');
                            $('ul:first', $liparent).slideUp();
                        } else {
                            $liparent.addClass('active');
                            $('ul:first', $liparent).slideDown();
                        }
                    } else {
                        $liparent.parents('li').addClass('active')
                    }
                });


                scope.shouldBeActive = function(state) {
                    return $state.includes(state);
                }


            }
        };
    }]);

    cie.directive('resizeRightColumn', function() {
        return function(scope, element) {
            var element = $(element);
            element.css("min-height", $(window).height());
            $(window).resize(function() {
                element.css("min-height", $(window).height());
            });
        }
    });


    cie.filter('capitalize', function() {
        return function(input, param) {
            if (!input) return false;
            if (param) {

                if (param == 'oneLetter') {
                    var newImput = "";
                    angular.forEach(input.split(" "), function(val, idx) {
                        if (val.length <= 1) {
                            newImput += val.toLowerCase() + ' '
                        } else {
                            newImput += val.charAt(0).toUpperCase() + val.substr(1).toLowerCase() + ' '
                        }
                    })
                    return newImput;
                }

            } else {
                return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
            }
        }
    });

    cie.run(['appName', '$rootScope', 'PermissionStore', 'authFactory', 'apiResource', '$state', 'DTDefaultOptions', 'envService', function(appName, $rootScope, PermissionStore, authFactory, apiResource, $state, DTDefaultOptions, envService) {

        DTDefaultOptions.setLanguageSource('frontend/assets/js/datatables/es.json');
        DTDefaultOptions.setOption("processing", true);

        $rootScope.appname = appName;

        $rootScope.logout = function() {
            authFactory.logout().then(function() {
                apiResource.clearAllCache(); // clear all cache
                $state.go('adminAuth');
            });
        }

        PermissionStore.definePermission('isloggedin', function(stateParams) {
            if (authFactory.authenticated()) {
                return true; // Is loggedin
            }
            return false;
        });


        PermissionStore.definePermission('anonymous', function(stateParams) {
            if (!authFactory.authenticated()) {
                return true; // Is loggedin
            }
            return false;
        });

        $rootScope.isMenuCollapsed = false; //menu collapsed

        $rootScope.auth = {};

        var userInStorage = localStorage.getItem('user');
        if (userInStorage != "undefined") {
            $rootScope.currentUser = JSON.parse(localStorage.getItem('user'));
        }


        /**
            RESOURCES
        **/
        
        //users
        apiResource.resource("users", envService.read('api') + 'users/:id', {
            id: '@id'
        }).register();

    }]);

    cie.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'envServiceProvider', '$authProvider', '$validatorProvider', function($stateProvider, $locationProvider, $urlRouterProvider, envServiceProvider, $authProvider, $validatorProvider) {

        $locationProvider.html5Mode(true);

        envServiceProvider.config({
            domains: {
                development: ['cie2.local'],
                home: ['cie.local']
            },
            vars: {
                development: {
                    authorization: 'http://cie2.local/backend/api/authenticate/login',
                    api: 'http://cie2.local/backend/api/',
                },
                home: {
                    authorization: 'http://cie.local/backend/api/authenticate/login',
                    api: 'http://cie.local/backend/api/',
                }
            }
        });


        //validators to
        $validatorProvider.setDefaults({
            errorElement: 'span',
            errorClass: 'help-block',
            highlight: function(element) {
                $(element).closest('.form-group').addClass('has-error');
            },
            unhighlight: function(element) {
                $(element).closest('.form-group').removeClass('has-error');
            },
            errorPlacement: function(error, element) {
                error.insertAfter(element);

            }
        });

        //check Environments
        envServiceProvider.check();

        $authProvider.loginUrl = envServiceProvider.read('authorization');



        $urlRouterProvider.otherwise('/errors/404');

        $stateProvider.state('index', angularAMD.route({
            url: '/',
            data: {
                permissions: {
                    except: ['isloggedin', 'anonymous'],
                    redirectTo: {
                        isloggedin: {
                            state: "root.dashboard"
                        },
                        anonymous: {
                            state: 'adminAuth'
                        },
                        default: 'adminAuth'
                    }
                },
                pageTitle: "Ingreso"
            }
        }));

        $stateProvider.state('adminAuth', angularAMD.route({
            url: '/login',
            controllerUrl: 'frontend/components/auth/auth',
            views: {
                "@": {
                    templateUrl: "frontend/components/auth/login.html",
                    controller: 'LoginCtrl'
                }
            },
            data: {
                css: ['frontend/assets/css/login.css'],
                permissions: {
                    except: ['isloggedin'],
                    redirectTo: "root.dashboard"
                },
                pageTitle: "Ingreso"
            }
        }));

        $stateProvider.state('errors.404', angularAMD.route({
            url: '/errors/404',
            templateUrl: "frontend/components/errors/404.html",
            data: {
                pageTitle: "No encontrado"
            }
        }));


        $stateProvider.state('root', angularAMD.route({
            url: '/',
            abstract: true,
            views: {
                "root": {
                    templateUrl: 'frontend/layouts/master.html'
                },
                "leftNav@root": {
                    templateUrl: 'frontend/partials/left.html'
                },
                "topNav@root": {
                    templateUrl: 'frontend/partials/top.html'
                }
            },
            data: {
                permissions: {
                    except: ['anonymous'],
                    redirectTo: "adminAuth"
                },
                css: ['frontend/assets/css/custom.css', 'frontend/assets/css/animate.css', 'frontend/bower_components/angular-bootstrap/ui-bootstrap-csp.css'],
            }
        }));


        $stateProvider.state('root.dashboard', angularAMD.route({
            url: 'dashboard',
            controllerUrl: 'frontend/components/dashboard/dashboard',
            views: {
                "content@root": {
                    templateUrl: 'frontend/components/dashboard/dashboard.html',
                    controller: 'DashboardCtrl'
                }

            },
            data: {
                permissions: {
                    except: ['anonymous'],
                    redirectTo: "adminAuth"
                },
                pageTitle: "Escritorio"
            }
        }));


        $stateProvider.state('root.user', angularAMD.route({
            url: 'users',
            controllerUrl: 'frontend/components/user/user',
            views: {
                "content@root": {
                    templateUrl: 'frontend/components/user/index.html',
                    controller: 'UserIdxCtrl'
                }

            },
            data: {
                permissions: {
                    except: ['anonymous'],
                    redirectTo: "adminAuth"
                },
                css: ['frontend/bower_components/angular-datatables/dist/css/angular-datatables.min.css', 'frontend/bower_components/angular-datatables/dist/plugins/bootstrap/datatables.bootstrap.min.css'],
                pageTitle: "Usuarios"
            }
        }));
    }]);



    angularAMD.bootstrap(cie);

    return cie;

});