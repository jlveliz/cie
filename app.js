"use strict";

define([
    'angularAMD',
    'moment',
    'jquery',
    'underscore',
    'angular',
    'angular-material',
    'jquery-validation',
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
    'angular-datatables-bootstrap',
    'angular-moment',
], function(angularAMD, moment, $) {

    var cie = angular.module('cieApp', ['ui.router', 'ngResource', 'uiRouterStyles', 'satellizer', 'environment', 'ngValidate', 'permission', 'datatables', 'ui.bootstrap', 'datatables.bootstrap', 'ngMaterial']);

    cie.constant('appName', 'CIE');

    cie.provider('apiResource', function() {
        return {
            $get: ['$resource', "$q", '$cacheFactory', '$http', function($resource, $q, $cacheFactory, $http) {
                var names = {};
                var caching = $cacheFactory('cieCache');
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
                                    },
                                    save: {
                                        method: "POST",
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
                                    angular.copy(result, copy);
                                    copy.$original = result;
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
                                var keyCache = params.id + '_' + nameResource;
                                if (params && params.parentId) {
                                    keyCache += '/' + params.parentId;
                                }

                                var resource = getFromCache(keyCache);
                                if (resource) {
                                    deferred.resolve(resource);
                                    return deferred.promise;
                                }

                                var keyCache = nameResource;
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
                                var _this = this;
                                this.get(param).then(function(result) {
                                    angular.copy(result, copy);
                                    copy = _this.create(copy);
                                    copy.$original = result;
                                    deferred.resolve(copy);
                                })
                                return deferred.promise;
                            },
                            setOnCache: function(resource, isNested) {
                                if (!names[nameResource]) {
                                    throw "Recurso " + nameResource + " no existe";
                                }
                                var idCookie = nameResource;
                                if (isNested) idCookie += '/' + isNested;

                                if (!angular.isArray(resource)) {
                                    idCookie = resource.id + '_' + idCookie;
                                    caching.put(idCookie, resource);
                                    //find on main Collection
                                    var arrayCache = getFromCache(nameResource);
                                    if (arrayCache) {
                                        var idxArray = _.findIndex(arrayCache, function(item) {
                                            return item.id == resource.id;
                                        });
                                        if (idxArray > -1) {
                                            arrayCache[idxArray] = resource;
                                        } else {
                                            arrayCache.push(resource);
                                        }
                                    }
                                } else {
                                    caching.put(nameResource, resource);
                                }
                            },
                            removeFromCache: function(itemId, isNested) {
                                var idCookie = itemId + '_' + nameResource;
                                if (isNested) idCookie += '/' + isNested;
                                if (!names[nameResource]) {
                                    throw "Recurso " + nameResource + " no existe";
                                }

                                var cached = getFromCache(idCookie);
                                if (cached) {
                                    caching.remove(idCookie);
                                }

                                var idCookie = nameResource;
                                var cached = getFromCache(idCookie);

                                if (cached) {
                                    if (angular.isArray(cached)) {
                                        var idxArray = _.findIndex(cached, function(item) {
                                            return item.id == itemId;
                                        });
                                        if (idxArray > -1) cached.splice(idxArray, 1);
                                    }
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

    cie.factory('authFactory', ['$auth', '$http', 'envService', '$q', '$rootScope', 'apiResource', function($auth, $http, envService, $q, $rootScope, apiResource) {
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
            },
            hasPermission: function(key) {
                var deferred = $q.defer();
                if (this.authenticated()) {
                    var roles = $rootScope.currentUser.roles;
                    var permUsers = $rootScope.currentUser.permissions;

                    var permissions = [];

                    angular.forEach(roles, function(role) {
                        angular.forEach(role.permissions, function(perm) {
                            permissions.push(perm.code);
                        })
                    });

                    angular.forEach(permUsers, function(perm) {
                        permissions.push(perm.code);
                    })

                    var found = _.findIndex(permissions, function(el) {
                        if (el == key) return true;
                    });

                    found > -1 ? deferred.resolve() : deferred.reject();

                    return deferred.promise;
                }
            },
            hasRole: function(keyRol) {
                var deferred = $q.defer();
                if (this.authenticated()) {
                    var rolesUser = $rootScope.currentUser.roles;
                    var found = _.findIndex(rolesUser, function(el) {
                        if (el.code == keyRol) return true;
                    });
                    found > -1 ? deferred.resolve() : deferred.reject();
                    return deferred.promise;

                }
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

    cie.directive('backendMenu', ['$state', 'apiResource', '$cacheFactory', 'envService', function($state, apiResource, $cacheFactory, envService) {
        return {
            restrict: 'E',
            templateUrl: "frontend/partials/nav.html",
            link: function(scope, iElement, iAttrs) {

                var caching = $cacheFactory.get('cieCache');
                scope.navElements = [];

                var reqPermissions = {
                    method: 'GET',
                    url: envService.read('api') + 'menu'
                };

                apiResource.loadFromApi(reqPermissions).then(function(data) {
                    scope.navElements = []
                    angular.forEach(data, function(module, idx) {
                        var elemMenu = {
                            section: module.name,
                            navEls: []
                        }
                        angular.forEach(module.permissions, function(permission) {
                            elemMenu.navEls.push(formatPermission(permission));
                        })
                        scope.navElements.push(elemMenu);
                    })
                });

                var formatPermission = function(permission) {
                    var menuOpt = {
                        label: permission.name,
                        icon: permission.fav_icon,
                        desc: permission.description
                    };
                    if (permission.children && permission.children.length) {
                        menuOpt.children = [];
                        angular.forEach(permission.children, function(children) {
                            menuOpt.children.push(formatPermission(children));
                        })
                    } else {
                        menuOpt.sref = permission.resource
                    }
                    return menuOpt;
                };

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

    cie.filter('filterTimestamp', function() {
        return function(value) {
            if (!value) return '-';
            return moment(value).format("l");
        }
    });

    cie.run(['apiResource', 'envService', function(apiResource, envService) {

        //users
        apiResource.resource("users", envService.read('api') + 'users/:id', {
            id: '@id'
        }).register();

        //modules
        apiResource.resource("modules", envService.read('api') + 'modules/:id', {
            id: '@id'
        }).register();

        //permissions
        apiResource.resource("permissions", envService.read('api') + 'permissions/:id', {
            id: '@id'
        }).register();

        //tpermissions
        apiResource.resource("tpermissions", envService.read('api') + 'typepermissions/:id', {
            id: '@id'
        }).register();

        //roles
        apiResource.resource("roles", envService.read('api') + 'roles/:id', {
            id: '@id'
        }).register();

        //roles
        apiResource.resource("puserinscriptions", envService.read('api') + 'pUsers/:id', {
            id: '@id'
        }).register();

    }]);

    /** 
    ===========PERMISSIONS & ROLES ====================
    **/
    cie.run(['$rootScope', 'PermissionStore', 'authFactory', 'RoleStore', 'apiResource', function($rootScope, PermissionStore, authFactory, RoleStore, apiResource) {


        PermissionStore.definePermission('isloggedin', function(permissionName, transitionProperties) {
            if (authFactory.authenticated()) {
                return true; // Is loggedin
            }
            return false;
        });


        PermissionStore.definePermission('anonymous', function(permissionName, transitionProperties) {
            if (!authFactory.authenticated()) {
                return true; // Is loggedin
            }
            return false;
        });


        apiResource.resource('permissions').query().then(function(permissions) {
            var succesCallback = function() {
                return true;
            }

            var failCallbacks = function() {
                return false;
            }



            angular.forEach(permissions, function(permi) {
                PermissionStore.definePermission(permi.code, function(permissionName) {
                    return authFactory.hasPermission(permissionName).then(succesCallback, failCallbacks);
                })
            });

            //roles
            apiResource.resource('roles').query().then(function(roles) {
                angular.forEach(roles, function(role) {
                    var permRoles = [];
                    angular.forEach(role.permissions, function(permRole) {
                        permRoles.push(permRole.code);
                    })
                    RoleStore.defineRole(role.code, permRoles, function(roleName) {
                        return authFactory.hasRole(role.code)
                    })
                })
            })
        });

        /**
            ===========PERMISSIONS & ROLES ====================
        **/

    }]);

    cie.run(['appName', '$rootScope', '$uibModal', '$q', 'DTDefaultOptions', 'authFactory', 'apiResource', '$state', function(appName, $rootScope, $uibModal, $q, DTDefaultOptions, authFactory, apiResource, $state) {

        $rootScope.isMenuCollapsed = false; //menu collapsed

        $rootScope.auth = {};

        DTDefaultOptions.setLanguageSource('frontend/assets/js/datatables/es.json');
        DTDefaultOptions.setOption("processing", true);

        var userInStorage = localStorage.getItem('user');
        if (userInStorage != "undefined") {
            $rootScope.currentUser = JSON.parse(localStorage.getItem('user'));
        }

        $rootScope.appname = appName;

        $rootScope.logout = function() {
            authFactory.logout().then(function() {
                apiResource.clearAllCache(); // clear all cache
                $state.go('adminAuth');
            });
        }


        $rootScope.openSuccessModal = function(params) {
            var deferred = $q.defer();
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: false,
                templateUrl: 'frontend/partials/modal-success.html',
                resolve: {
                    modalContent: function() {
                        return params
                    }
                },
                controller: function($scope, modalContent, $uibModalInstance) {
                    $scope.modalContent = modalContent;
                    $scope.ok = function() {
                        $uibModalInstance.close();
                        deferred.resolve();
                    }
                }

            });

            modalInstance.result.then(function() {
                deferred.resolve();
            }).catch(function() {
                deferred.reject();
            })

            return deferred.promise;
        }

        $rootScope.openErrorModal = function(params) {
            var deferred = $q.defer();
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: false,
                templateUrl: 'frontend/partials/modal-error.html',
                resolve: {
                    modalContent: function() {
                        return params
                    }
                },
                controller: function($scope, modalContent, $uibModalInstance) {
                    $scope.modalContent = modalContent;
                    $scope.ok = function() {
                        $uibModalInstance.close();
                        deferred.resolve();
                    }
                }
            });

            modalInstance.result.then(function() {
                deferred.resolve();
            }).catch(function() {
                deferred.reject();
            })

            return deferred.promise;
        }

        $rootScope.openDelteModal = function(params) {
            var deferred = $q.defer();
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: false,
                templateUrl: 'frontend/partials/modal-delete.html',
                resolve: {
                    modalContent: function() {
                        return params
                    }
                },
                controller: function($scope, modalContent, $uibModalInstance) {
                    $scope.modalContent = modalContent;

                    $scope.delete = function(model) {
                        $uibModalInstance.close();
                    }
                }
            });

            modalInstance.result.then(function() {
                deferred.resolve();
            }).catch(function() {
                deferred.reject();
            })

            return deferred.promise;
        }

    }])

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


        //check Environments
        envServiceProvider.check();

        $authProvider.loginUrl = envServiceProvider.read('authorization');

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

        $validatorProvider.addMethod("valueNotEquals", function(value, element, arg) {
            return value !== arg;
        }, "Value must not equal arg.");


        $validatorProvider.addMethod("unique", function(value, element, arg) {
            var success = false;
            var params = arg.split(',');
            var table = params[0];
            var column = params[1];
            var id = null;
            if (typeof params[2] != 'undefined') {
                id = params[2];
            }
            $.ajax({
                url: envServiceProvider.read('api') + 'validator/unique?table=' + table + '&columnname=' + column + '&value=' + value + '&id=' + id,
                type: 'GET',
                async: false,
                success: function(result) {
                    success = result === "ok" ? true : false;
                }

            });
            return success;
        }, "Not Unique.");

        $validatorProvider.addMethod("exists", function(value, element, arg) {
            var success = false;
            var table = arg;
            var value = value.split(':');
            value = value[1];
            $.ajax({
                url: envServiceProvider.read('api') + 'validator/exists?table=' + table + '&value=' + value,
                type: 'GET',
                async: false,
                success: function(result) {
                    success = result === "ok" ? true : false;
                }
            });
            return success;
        }, "Already exist.");


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
                css: ['frontend/assets/css/custom.css', 'frontend/assets/css/animate.css', 'frontend/bower_components/angular-bootstrap/ui-bootstrap-csp.css', 'frontend/bower_components/angular-material/angular-material.css'],
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
                    // only: ['UsNormal', 'admin', 'isloggedin'],
                    except: ['anonymous'],
                    redirectTo: "adminAuth"
                },
                pageTitle: "Escritorio"
            }
        }));

        /**
            USER
        **/
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
                    only: ['admin'],
                    except: ['anonymous'],
                    redirectTo: "adminAuth"
                },
                css: ['frontend/bower_components/angular-datatables/dist/css/angular-datatables.min.css', 'frontend/bower_components/angular-datatables/dist/plugins/bootstrap/datatables.bootstrap.min.css'],
                pageTitle: "Usuarios"
            }
        }));

        $stateProvider.state('root.user.create', angularAMD.route({
            url: '/create',
            controllerUrl: 'frontend/components/user/user',
            views: {
                "content@root": {
                    templateUrl: 'frontend/components/user/create.html',
                    controller: 'UserCreateCtrl'
                }

            },
            data: {
                permissions: {
                    only: ['admin'],
                    except: ['anonymous'],
                    redirectTo: "adminAuth"
                },
                css: ['frontend/assets/css/checkbox-bootstrap.css'],
                pageTitle: "Usuarios"
            }
        }));

        $stateProvider.state('root.user.edit', angularAMD.route({
            url: '/{userId:int}/edit',
            controllerUrl: 'frontend/components/user/user',
            views: {
                "content@root": {

                    templateUrl: 'frontend/components/user/edit.html',
                    controller: 'UserEditCtrl'
                }

            },
            data: {
                permissions: {
                    only: ['admin'],
                    except: ['anonymous'],
                    redirectTo: "adminAuth"
                },
                css: ['frontend/assets/css/checkbox-bootstrap.css'],
                pageTitle: "Usuarios"
            }
        }));

        /**
            MODULE
        **/
        $stateProvider.state('root.module', angularAMD.route({
            url: 'modules',
            controllerUrl: 'frontend/components/module/module',
            views: {
                "content@root": {
                    templateUrl: 'frontend/components/module/index.html',
                    controller: 'ModuleIdxCtrl'
                }

            },
            data: {
                permissions: {
                    only: ['admin'],
                    except: ['anonymous'],
                    redirectTo: "adminAuth"
                },
                css: ['frontend/bower_components/angular-datatables/dist/css/angular-datatables.min.css', 'frontend/bower_components/angular-datatables/dist/plugins/bootstrap/datatables.bootstrap.min.css'],
                pageTitle: "Módulos"
            }
        }));

        $stateProvider.state('root.module.create', angularAMD.route({
            url: '/create',
            controllerUrl: 'frontend/components/module/module',
            views: {
                "content@root": {
                    templateUrl: 'frontend/components/module/create.html',
                    controller: 'ModuleCreateCtrl'
                }

            },
            data: {
                permissions: {
                    only: ['admin'],
                    except: ['anonymous'],
                    redirectTo: "adminAuth"
                },
                pageTitle: "Módulos"
            }
        }));

        $stateProvider.state('root.module.edit', angularAMD.route({
            url: '/{moduleId:int}/edit',
            controllerUrl: 'frontend/components/module/module',
            views: {
                "content@root": {
                    templateUrl: 'frontend/components/module/edit.html',
                    controller: 'ModuleEditCtrl'
                }

            },
            data: {
                permissions: {
                    only: ['admin'],
                    except: ['anonymous'],
                    redirectTo: "adminAuth"
                },
                pageTitle: "Módulos"
            }
        }));

        /**
            PERMISSION
        **/
        $stateProvider.state('root.permission', angularAMD.route({
            url: 'permissions',
            controllerUrl: 'frontend/components/permission/permission',
            views: {
                "content@root": {
                    templateUrl: 'frontend/components/permission/index.html',
                    controller: 'PermissionIdxCtrl'
                }

            },
            data: {
                permissions: {
                    only: ['admin'],
                    except: ['anonymous'],
                    redirectTo: "adminAuth"
                },
                css: ['frontend/bower_components/angular-datatables/dist/css/angular-datatables.min.css', 'frontend/bower_components/angular-datatables/dist/plugins/bootstrap/datatables.bootstrap.min.css'],
                pageTitle: "Permisos"
            }
        }));

        $stateProvider.state('root.permission.create', angularAMD.route({
            url: '/create',
            controllerUrl: 'frontend/components/permission/permission',
            views: {
                "content@root": {
                    templateUrl: 'frontend/components/permission/create.html',
                    controller: 'PermissionCreateCtrl'
                }

            },
            data: {
                permissions: {
                    only: ['admin'],
                    except: ['anonymous'],
                    redirectTo: "adminAuth"
                },
                pageTitle: "Permisos"
            }
        }));

        $stateProvider.state('root.permission.edit', angularAMD.route({
            url: '/{permissionId:int}/edit',
            controllerUrl: 'frontend/components/permission/permission',
            views: {
                "content@root": {
                    templateUrl: 'frontend/components/permission/edit.html',
                    controller: 'PermissionEditCtrl'
                }

            },
            data: {
                permissions: {
                    only: ['admin'],
                    except: ['anonymous'],
                    redirectTo: "adminAuth"
                },
                pageTitle: "Permisos"
            }
        }));

        /**
            TYPE PERMISSION
        **/
        $stateProvider.state('root.tpermission', angularAMD.route({
            url: 'type-permissions',
            controllerUrl: 'frontend/components/tpermission/tpermission',
            views: {
                "content@root": {
                    templateUrl: 'frontend/components/tpermission/index.html',
                    controller: 'TPermissionIdxCtrl'
                }

            },
            data: {
                permissions: {
                    only: ['admin'],
                    except: ['anonymous'],
                    redirectTo: "adminAuth"
                },
                css: ['frontend/bower_components/angular-datatables/dist/css/angular-datatables.min.css', 'frontend/bower_components/angular-datatables/dist/plugins/bootstrap/datatables.bootstrap.min.css'],
                pageTitle: "Tipos de Permisos"
            }
        }));

        $stateProvider.state('root.tpermission.create', angularAMD.route({
            url: '/create',
            controllerUrl: 'frontend/components/tpermission/tpermission',
            views: {
                "content@root": {
                    templateUrl: 'frontend/components/tpermission/create.html',
                    controller: 'TPermissionCreateCtrl'
                }

            },
            data: {
                permissions: {
                    only: ['admin'],
                    except: ['anonymous'],
                    redirectTo: "adminAuth"
                },
                pageTitle: "Tipos de Permisos"
            }
        }));

        $stateProvider.state('root.tpermission.edit', angularAMD.route({
            url: '/{tPermissionId:int}/edit',
            controllerUrl: 'frontend/components/tpermission/tpermission',
            views: {
                "content@root": {
                    templateUrl: 'frontend/components/tpermission/edit.html',
                    controller: 'TPermissionEditCtrl'
                }

            },
            data: {
                permissions: {
                    only: ['admin'],
                    except: ['anonymous'],
                    redirectTo: "adminAuth"
                },
                pageTitle: "Tipos de Permisos"
            }
        }));

        /**
            ROLES
        **/
        $stateProvider.state('root.role', angularAMD.route({
            url: 'roles',
            controllerUrl: 'frontend/components/role/role',
            views: {
                "content@root": {
                    templateUrl: 'frontend/components/role/index.html',
                    controller: 'RoleIdxCtrl'
                }

            },
            data: {
                permissions: {
                    only: ['admin'],
                    except: ['anonymous'],
                    redirectTo: "adminAuth"
                },
                css: ['frontend/bower_components/angular-datatables/dist/css/angular-datatables.min.css', 'frontend/bower_components/angular-datatables/dist/plugins/bootstrap/datatables.bootstrap.min.css'],
                pageTitle: "Roles"
            }
        }));

        $stateProvider.state('root.role.create', angularAMD.route({
            url: '/create',
            controllerUrl: 'frontend/components/role/role',
            views: {
                "content@root": {
                    templateUrl: 'frontend/components/role/create.html',
                    controller: 'RoleCreateCtrl'
                }

            },
            data: {
                permissions: {
                    only: ['admin'],
                    except: ['anonymous'],
                    redirectTo: "adminAuth"
                },
                css: ['frontend/assets/css/checkbox-bootstrap.css'],
                pageTitle: "Roles"
            }
        }));

        $stateProvider.state('root.role.edit', angularAMD.route({
            url: '/{roleId:int}/edit',
            controllerUrl: 'frontend/components/role/role',
            views: {
                "content@root": {
                    templateUrl: 'frontend/components/role/edit.html',
                    controller: 'RoleEditCtrl'
                }

            },
            data: {
                permissions: {
                    only: ['admin'],
                    except: ['anonymous'],
                    redirectTo: "adminAuth"
                },
                css: ['frontend/assets/css/checkbox-bootstrap.css'],
                pageTitle: "Roles"
            }
        }));


         /**
            INSCRIPCTIONS
        **/
        $stateProvider.state('root.inscription', angularAMD.route({
            url: 'inscriptions',
            controllerUrl: 'frontend/components/pUserInscription/pUserInscription',
            views: {
                "content@root": {
                    templateUrl: 'frontend/components/pUserInscription/index.html',
                    controller: 'pUserInscriptionIdxCtrl'
                }
            },
            data: {
                permissions: {
                    only: ['admin'],
                    except: ['anonymous'],
                    redirectTo: "adminAuth"
                },
                css: ['frontend/bower_components/angular-datatables/dist/css/angular-datatables.min.css', 'frontend/bower_components/angular-datatables/dist/plugins/bootstrap/datatables.bootstrap.min.css'],
                pageTitle: "Fichas de Inscripción"
            }
        })); 

        $stateProvider.state('root.inscription.create', angularAMD.route({
            url: '/create',
            controllerUrl: 'frontend/components/pUserInscription/pUserInscription',
            views: {
                "content@root": {
                    templateUrl: 'frontend/components/pUserInscription/create-edit.html',
                    controller: 'pUserInscriptionCreateCtrl'
                }
            },
            data: {
                permissions: {
                    only: ['admin'],
                    except: ['anonymous'],
                    redirectTo: "adminAuth"
                },
                pageTitle: "Creación de Fichas de Inscripción"
            }
        
        })); 

        $stateProvider.state('root.inscription.edit', angularAMD.route({
             url: '/{pInsId:int}/edit',
            controllerUrl: 'frontend/components/pUserInscription/pUserInscription',
            views: {
                "content@root": {
                    templateUrl: 'frontend/components/pUserInscription/create-edit.html',
                    controller: 'pUserInscriptionEditCtrl'
                }
            },
            data: {
                permissions: {
                    only: ['admin'],
                    except: ['anonymous'],
                    redirectTo: "adminAuth"
                },
                pageTitle: "Creación de Fichas de Inscripción"
            }
        
        }));

    }]);



    angularAMD.bootstrap(cie);

    return cie;

});