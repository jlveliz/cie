require.config({
    waitSeconds: 0,
    paths: {
        'jquery': 'frontend/bower_components/jquery/dist/jquery',
        'angularAMD': 'frontend/bower_components/angularAMD/angularAMD',
        'angular': 'frontend/bower_components/angular/angular.min',
        'angular-ui-router': 'frontend/bower_components/angular-ui-router/release/angular-ui-router',
        'angular-resource': 'frontend/bower_components/angular-resource/angular-resource.min',
        'angular-ui-router-styles': 'frontend/bower_components/angular-ui-router-styles/ui-router-styles',
    },
    shim: {
        'jquery': {
            exports: 'jquery',
        },
        'angularAMD': {
            exports: 'angularAMD',
        },
        'angular': {
            exports: 'angular',
            deps: ['jquery'],
        },
        'angular-ui-router': {
            deps: ['angular']
        },
        'angular-resource': {
            exports: 'angular-resource',
            deps: ['angular'],
        },
        'angular-ui-router-styles': {
            deps: ['angular']
        }
    },
    deps: ['app']
});