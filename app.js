"use strict";

define([
    'angularAMD',
    'moment',
    'jquery',
    'pdfmake',
    'vfs_fonts',
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
                                        method: "GET"
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

                    if (found > -1)
                        deferred.resolve()
                    else
                        deferred.reject();

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
    }]);

    cie.factory('layoutReportFactory', ['envService', '$q', function(envService, $q) {
        function getBase64Image(imgUrl) {
            return new Promise(
                function(resolve, reject) {

                    var img = new Image();
                    img.src = imgUrl;
                    img.setAttribute('crossOrigin', 'anonymous');

                    img.onload = function() {
                        var canvas = document.createElement("canvas");
                        canvas.width = img.width;
                        canvas.height = img.height;
                        var ctx = canvas.getContext("2d");
                        ctx.drawImage(img, 0, 0);
                        var dataURL = canvas.toDataURL("image/png");
                        resolve(dataURL.replace(/^data:image\/(png|jpg);base64,/, ""));
                    }
                    img.onerror = function() {
                        reject("The image could not be loaded.");
                    }

                });

        }
        return {
            getHeader: function() {
                var deferred = $q.defer();
                var imgUrl = envService.read('assets') + '/images/header_report.png'
                getBase64Image(imgUrl).then(function(base64) {
                    base64 = 'data:image/png;base64,' + base64
                    deferred.resolve({
                        image: base64,
                        width: 600,
                        height: 85
                    })
                })
                return deferred.promise;
            },
            getFooter: function() {
                var deferred = $q.defer();
                var imgUrl = envService.read('assets') + '/images/footer_report.png';
                getBase64Image(imgUrl).then(function(base64) {
                    base64 = 'data:image/png;base64,' + base64
                    deferred.resolve({
                        image: base64,
                        width: 595,
                        height: 80,
                        margin: [0, -35, 0, 10]

                    })
                })
                return deferred.promise;
            },
            getLayout: function(params) {
                var deferred = $q.defer();
                var _this = this;
                this.getHeader().then(function(header) {
                    var layout = {};
                    layout.defaultStyle = {
                        font: 'timeNewRoman'
                    }
                    layout.styles = {
                        header: {
                            fontSize: 22,
                            bold: true,
                            alignment: 'center',
                            margin: [0, 0, 0, 20]
                        },
                        content: {
                            fontSize: 12,
                            alignment: 'justify',
                            margin: [0, 15]
                        }
                    };
                    layout.pageSize = params.size ? params.size : 'A4';
                    layout.pageOrientation = params.orientation === 'landscape' ? 'landscape' : 'portrait';
                    layout.pageMargins = params.margins ? [params.margins.left ? params.margins.left : 0, params.margins.top ? params.margins.top : 0, params.margins.right ? params.margins.right : 0, params.margins.bottom ? params.margins.bottom : 0] : [0, 0, 0, 0];
                    layout.header = header;
                    _this.getFooter().then(function(footer) {
                        layout.footer = footer;
                        deferred.resolve(layout);
                    })
                })
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

    cie.directive('maxDateToday', [function() {
        return {
            restrict: 'C',
            require: 'ngModel',
            scope: {
                ngModel: '='
            },
            link: function(scope, iElement, iAttrs, ngModelCtrl) {
                var today = new Date();
                var dd = today.getDate();
                var mm = today.getMonth() + 1; //January is 0!
                var yyyy = today.getFullYear();
                if (dd < 10) {
                    dd = '0' + dd
                }

                if (mm < 10) {
                    mm = '0' + mm
                }

                today = yyyy + '-' + mm + '-' + dd;
                iElement.attr('max', today);
            }
        };
    }])


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

    cie.directive('numbersOnly', function() {
        return {
            require: 'ngModel',
            link: function(scope, element, attr, ngModelCtrl) {
                function fromUser(text) {
                    if (text) {
                        var transformedInput = text.replace(/[^0-9]/g, '');

                        if (transformedInput !== text) {
                            ngModelCtrl.$setViewValue(transformedInput);
                            ngModelCtrl.$render();
                        }
                        return transformedInput;
                    }
                    return undefined;
                }
                ngModelCtrl.$parsers.push(fromUser);
            }
        };
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

        //inscriptions
        apiResource.resource("puserinscriptions", envService.read('api') + 'pUsers/:id', {
            id: '@id'
        }).register();

        //provinces
        apiResource.resource("provinces", envService.read('api') + 'provinces/:id', {
            id: '@id'
        }).register();

        //cities
        apiResource.resource("cities", envService.read('api') + 'cities/:id', {
            id: '@id'
        }).register();

        //parish
        apiResource.resource("parishies", envService.read('api') + 'parishies/:id', {
            id: '@id'
        }).register();

        //pathologies
        apiResource.resource("pathologies", envService.read('api') + 'pathologies/:id', {
            id: '@id'
        }).register();

    }]);

    /** 
    ===========PERMISSIONS & ROLES ====================
    **/
    cie.run(['$rootScope', 'PermissionStore', 'authFactory', 'RoleStore', 'apiResource', '$urlRouter', '$q', function($rootScope, PermissionStore, authFactory, RoleStore, apiResource, $urlRouter, $q) {


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

            angular.forEach(permissions, function(permi) {
                PermissionStore.definePermission(permi.code, function(permissionName) {
                    return authFactory.hasPermission(permissionName)
                })
            });

            //roles
            apiResource.resource('roles').query().then(function(roles) {
                angular.forEach(roles, function(role) {
                    var permRoles = [];
                    angular.forEach(role.permissions, function(permRole) {
                        permRoles.push(permRole.code);
                    })
                    RoleStore.defineRole(role.code, permRoles);
                })
            }).then(function() {
                // Once permissions are set-up 
                // kick-off router and start the application rendering
                $urlRouter.sync();
                // Also enable router to listen to url changes
                $urlRouter.listen();
            })
        });


        /**
            ===========PERMISSIONS & ROLES ====================
        **/

    }]);

    cie.run(['appName', '$rootScope', '$uibModal', '$q', 'DTDefaultOptions', 'authFactory', 'apiResource', '$state', 'RoleStore', 'PermissionStore', '$interval', function(appName, $rootScope, $uibModal, $q, DTDefaultOptions, authFactory, apiResource, $state, RoleStore, PermissionStore, $interval) {

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

        $rootScope.openPreviewModal = function(params) {
            var deferred = $q.defer();
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: false,
                size: 'lg',
                templateUrl: 'frontend/partials/modal-preview.html',
                resolve: {
                    params: function() {
                        return params
                    }
                },
                controller: function($scope, params, $uibModalInstance, $sce) {
                    $scope.title = params.title;
                    var content = params.content ? params.content : null;
                    $scope.type = params.type ? params.type : 'pdf';
                    $scope.loading = true;
                    $scope.content = null;

                    switch ($scope.type) {
                        default: pdfMake.createPdf(content).getBase64(function(result) {
                            $scope.content = $sce.trustAsResourceUrl('data:application/pdf;base64,' + result);
                            $scope.loading = false;
                        });
                        break;
                    }


                    $scope.print = function() {
                        pdfMake.createPdf(content).print()
                    }

                    $scope.download = function() {
                        pdfMake.createPdf(content).download($scope.title + '_' + moment().format('l'))
                    }

                    $scope.ok = function() {
                        $uibModalInstance.close();
                        deferred.resolve();
                    }
                }
            })
        }

        // REFRESH TOKEN EVERY 1 HOUR
        $interval(function() {
            if (!authFactory.authenticated()) {
                return;
            } else {
                authFactory.refreshToken().then(null, function(error) {
                    authFactory.logout();
                })
            }
        }, 3600000);

    }])

    cie.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'envServiceProvider', '$authProvider', '$validatorProvider', function($stateProvider, $locationProvider, $urlRouterProvider, envServiceProvider, $authProvider, $validatorProvider) {

        $locationProvider.html5Mode(true);

        //PDF CONFIG FONTS
        pdfMake.fonts = {
            timeNewRoman: {
                normal: 'times.ttf',
                bold: 'timesbd.ttf',
                italics: 'timesi.ttf',
                bolditalics: 'timesbi.ttf'
            }
        }
        //PDF CONFIG FONTS


        envServiceProvider.config({
            domains: {
                development: ['cie2.local'],
                home: ['cie.local'],
                server_develop_public: ['10.101.0.51'],
                server_prod_public: ['cie.guayas.gob.ec']
            },
            vars: {
                development: {
                    authorization: 'http://cie2.local/backend/api/authenticate/login',
                    api: 'http://cie2.local/backend/api/',
                },
                home: {
                    assets: 'http://cie.local/frontend/assets',
                    authorization: 'http://cie.local/backend/api/authenticate/login',
                    api: 'http://cie.local/backend/api/',
                },
                server_develop_public: {
                    assets: 'http://10.101.0.51/frontend/assets',
                    authorization: "http://10.101.0.51/backend/api/authenticate/login",
                    api: 'http://10.101.0.51/backend/api/',
                    public: 'http://10.101.0.51'
                },
                server_prod_public: {
                    assets: 'http://cie.guayas.gob.ec/frontend/assets',
                    authorization: "http://cie.guayas.gob.ec/backend/api/authenticate/login",
                    api: 'http://cie.guayas.gob.ec/backend/api/',
                    public: 'http://cie.guayas.gob.ec'
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
                $(element).parents('.form-group').addClass('has-error');
            },
            unhighlight: function(element) {
                $(element).parents('.form-group').removeClass('has-error');
            },
            errorPlacement: function(error, element) {
                var element = element.parents('.form-group');
                element.append(error);
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

        $validatorProvider.addMethod("isValidId", function(value, element, arg) {
            //Preguntamos si la value consta de 10 digitos
            if (value.length == 10) {
                //Obtenemos el digito de la region que sonlos dos primeros digitos
                var regionId = value.substring(0, 2);
                //Pregunto si la region existe ecuador se divide en 24 regiones
                if (regionId >= 1 && regionId <= 24) {
                    // Extraigo el ultimo digito
                    var lastDigit = value.substring(9, 10);
                    //Agrupo todos los pair y los sumo
                    var pair = parseInt(value.substring(1, 2)) + parseInt(value.substring(3, 4)) + parseInt(value.substring(5, 6)) + parseInt(value.substring(7, 8));
                    //Agrupo los odd, los multiplico por un factor de 2, si la resultante es > que 9 le restamos el 9 a la resultante
                    var numOne = value.substring(0, 1);
                    var numOne = (numOne * 2);
                    if (numOne > 9) { var numOne = (numOne - 9); }
                    var numThree = value.substring(2, 3);
                    var numThree = (numThree * 2);
                    if (numThree > 9) { var numThree = (numThree - 9); }
                    var numFive = value.substring(4, 5);
                    var numFive = (numFive * 2);
                    if (numFive > 9) { var numFive = (numFive - 9); }
                    var numSeven = value.substring(6, 7);
                    var numSeven = (numSeven * 2);
                    if (numSeven > 9) { var numSeven = (numSeven - 9); }
                    var numNine = value.substring(8, 9);
                    var numNine = (numNine * 2);
                    if (numNine > 9) { var numNine = (numNine - 9); }
                    var odd = numOne + numThree + numFive + numSeven + numNine;
                    //Suma total
                    var sumTotal = (pair + odd);
                    //extraemos el primero digito
                    var firstDigitSum = String(sumTotal).substring(0, 1);
                    //Obtenemos la ten inmediata
                    var ten = (parseInt(firstDigitSum) + 1) * 10;
                    //Obtenemos la resta de la ten inmediata - la sumTotal esto nos da el digito validador
                    var validatorDigit = ten - sumTotal;
                    //Si el digito validador es = a 10 toma el valor de 0
                    if (validatorDigit == 10)
                        var validatorDigit = 0;
                    //Validamos que el digito validador sea igual al de la value
                    if (validatorDigit == lastDigit) {
                        return true
                    } else {
                        return false
                    }

                } else {
                    // imprimimos en consola si la region no pertenece
                    return false;
                }
            } else {
                //imprimimos en consola si la value tiene mas o menos de 10 digitos
                return false;
            }
        }, "Invalid ID.");


        $validatorProvider.addMethod('notEqualtTo', function(value, element, arg) {
            function validateElem(elem) {
                if ($(elem).val() == value) return false;
                return true;
            }

            if (angular.isArray(arg)) {
                var results = [];
                angular.forEach(arg, function(el) {
                    if (validateElem(el)) {
                        results.push(true)
                    } else {
                        results.push(false);
                    }
                })

                if (_.contains(results, false)) return false;
                return true;
            } else {
                return validateElem(arg);
            }
        }, 'exist equal');

        $validatorProvider.addMethod('uniquePatient', function(value, element, arg) {
            var success = false;
            var params = arg.split(',');
            var id = null;

            if (typeof params[1] != 'undefined') {
                id = params[1];
            }

            $.ajax({
                url: envServiceProvider.read('api') + 'validator/uniquePatient?columnname=' + params[0] + '&value=' + value + '&id=' + id,
                type: 'GET',
                async: false,
                success: function(result) {
                    success = result === "ok" ? true : false;
                }

            });
            return success;

        }, 'patien exist')

        //if not found
        $urlRouterProvider.otherwise('/errors/404');
        // Prevent router from automatic state resolving
        $urlRouterProvider.deferIntercept();

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
            PROVINCES
        **/
        $stateProvider.state('root.province', angularAMD.route({
            url: 'provinces',
            controllerUrl: 'frontend/components/province/province',
            views: {
                "content@root": {
                    templateUrl: 'frontend/components/province/index.html',
                    controller: 'ProvinceIdxCtrl'
                }

            },
            data: {
                permissions: {
                    only: ['admin'],
                    except: ['anonymous'],
                    redirectTo: "adminAuth"
                },
                css: ['frontend/bower_components/angular-datatables/dist/css/angular-datatables.min.css', 'frontend/bower_components/angular-datatables/dist/plugins/bootstrap/datatables.bootstrap.min.css'],
                pageTitle: "Provincias"
            }
        }));

        $stateProvider.state('root.province.create', angularAMD.route({
            url: '/create',
            controllerUrl: 'frontend/components/province/province',
            views: {
                "content@root": {
                    templateUrl: 'frontend/components/province/create-edit.html',
                    controller: 'ProvinceCreateCtrl'
                }

            },
            data: {
                permissions: {
                    only: ['admin'],
                    except: ['anonymous'],
                    redirectTo: "adminAuth"
                },
                css: ['frontend/assets/css/checkbox-bootstrap.css'],
                pageTitle: "Provincias"
            }
        }));

        $stateProvider.state('root.province.edit', angularAMD.route({
            url: '/{provinceId:int}/edit',
            controllerUrl: 'frontend/components/province/province',
            views: {
                "content@root": {
                    templateUrl: 'frontend/components/province/create-edit.html',
                    controller: 'ProvinceEditCtrl'
                }

            },
            data: {
                permissions: {
                    only: ['admin'],
                    except: ['anonymous'],
                    redirectTo: "adminAuth"
                },
                css: ['frontend/assets/css/checkbox-bootstrap.css'],
                pageTitle: "Provincias"
            }
        }));

        /**
            CITY
        **/
        $stateProvider.state('root.city', angularAMD.route({
            url: 'cities',
            controllerUrl: 'frontend/components/city/city',
            views: {
                "content@root": {
                    templateUrl: 'frontend/components/city/index.html',
                    controller: 'CityIdxCtrl'
                }

            },
            data: {
                permissions: {
                    only: ['admin'],
                    except: ['anonymous'],
                    redirectTo: "adminAuth"
                },
                css: ['frontend/bower_components/angular-datatables/dist/css/angular-datatables.min.css', 'frontend/bower_components/angular-datatables/dist/plugins/bootstrap/datatables.bootstrap.min.css'],
                pageTitle: "Ciudades"
            }
        }));

        $stateProvider.state('root.city.create', angularAMD.route({
            url: '/create',
            controllerUrl: 'frontend/components/city/city',
            views: {
                "content@root": {
                    templateUrl: 'frontend/components/city/create-edit.html',
                    controller: 'CityCreateCtrl'
                }

            },
            data: {
                permissions: {
                    only: ['admin'],
                    except: ['anonymous'],
                    redirectTo: "adminAuth"
                },
                pageTitle: "Ciudades"
            }
        }));


        $stateProvider.state('root.city.edit', angularAMD.route({
            url: '/{cityId:int}/edit',
            controllerUrl: 'frontend/components/city/city',
            views: {
                "content@root": {
                    templateUrl: 'frontend/components/city/create-edit.html',
                    controller: 'CityEditCtrl'
                }

            },
            data: {
                permissions: {
                    only: ['admin'],
                    except: ['anonymous'],
                    redirectTo: "adminAuth"
                },
                pageTitle: "Ciudades"
            }
        }));

        /**
            PARISH
        **/
        $stateProvider.state('root.parish', angularAMD.route({
            url: 'parishies',
            controllerUrl: 'frontend/components/parish/parish',
            views: {
                "content@root": {
                    templateUrl: 'frontend/components/parish/index.html',
                    controller: 'ParishIdxCtrl'
                }

            },
            data: {
                permissions: {
                    only: ['admin'],
                    except: ['anonymous'],
                    redirectTo: "adminAuth"
                },
                css: ['frontend/bower_components/angular-datatables/dist/css/angular-datatables.min.css', 'frontend/bower_components/angular-datatables/dist/plugins/bootstrap/datatables.bootstrap.min.css'],
                pageTitle: "Parroquias"
            }
        }));

        $stateProvider.state('root.parish.create', angularAMD.route({
            url: '/create',
            controllerUrl: 'frontend/components/parish/parish',
            views: {
                "content@root": {
                    templateUrl: 'frontend/components/parish/create-edit.html',
                    controller: 'ParishCreateCtrl'
                }

            },
            data: {
                permissions: {
                    only: ['admin'],
                    except: ['anonymous'],
                    redirectTo: "adminAuth"
                },
                pageTitle: "Parroquias"
            }
        }));


        $stateProvider.state('root.parish.edit', angularAMD.route({
            url: '/{parishId:int}/edit',
            controllerUrl: 'frontend/components/parish/parish',
            views: {
                "content@root": {
                    templateUrl: 'frontend/components/parish/create-edit.html',
                    controller: 'ParishEditCtrl'
                }

            },
            data: {
                permissions: {
                    only: ['admin'],
                    except: ['anonymous'],
                    redirectTo: "adminAuth"
                },
                pageTitle: "Parroquias"
            }
        }));

        /**
            PATHOLOGY
        **/
        $stateProvider.state('root.pathology', angularAMD.route({
            url: 'pathologies',
            controllerUrl: 'frontend/components/pathology/pathology',
            views: {
                "content@root": {
                    templateUrl: 'frontend/components/pathology/index.html',
                    controller: 'PathologyIdxCtrl'
                }

            },
            data: {
                permissions: {
                    only: ['admin', 'dirTerapia'],
                    except: ['anonymous'],
                    redirectTo: "adminAuth"
                },
                css: ['frontend/bower_components/angular-datatables/dist/css/angular-datatables.min.css', 'frontend/bower_components/angular-datatables/dist/plugins/bootstrap/datatables.bootstrap.min.css'],
                pageTitle: "Patologías"
            }
        }));

        $stateProvider.state('root.pathology.create', angularAMD.route({
            url: '/create',
            controllerUrl: 'frontend/components/pathology/pathology',
            views: {
                "content@root": {
                    templateUrl: 'frontend/components/pathology/create-edit.html',
                    controller: 'PathologyCreateCtrl'
                }

            },
            data: {
                permissions: {
                    only: ['admin', 'dirTerapia'],
                    except: ['anonymous'],
                    redirectTo: "adminAuth"
                },
                pageTitle: "Patologías"
            }
        }));

        $stateProvider.state('root.pathology.edit', angularAMD.route({
            url: '/{pathologyId:int}/edit',
            controllerUrl: 'frontend/components/pathology/pathology',
            views: {
                "content@root": {
                    templateUrl: 'frontend/components/pathology/create-edit.html',
                    controller: 'PathologyEditCtrl'
                }

            },
            data: {
                permissions: {
                    only: ['admin', 'dirTerapia'],
                    except: ['anonymous'],
                    redirectTo: "adminAuth"
                },
                pageTitle: "Patologías"
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
                    only: ['UsNormal', 'dirTerapia'],
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
                    only: ['admin', 'UsNormal', 'dirTerapia'],
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
                    only: ['admin', 'UsNormal', 'dirTerapia'],
                    except: ['anonymous'],
                    redirectTo: "adminAuth"
                },
                pageTitle: "Edición de Fichas de Inscripción"
            }

        }));

    }]);



    angularAMD.bootstrap(cie);

    return cie;

});