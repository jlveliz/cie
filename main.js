require.config({
    waitSeconds: 0,
    paths: {
        'jquery': 'frontend/bower_components/jquery/dist/jquery',
        'jquery-validation': 'frontend/bower_components/jquery-validation/dist/jquery.validate.min',
        'jquery-datatables': 'frontend/bower_components/datatables.net/js/jquery.dataTables.min',
        'angularAMD': 'frontend/bower_components/angularAMD/angularAMD',
        'angular': 'frontend/bower_components/angular/angular.min',
        'angular-ui-router': 'frontend/bower_components/angular-ui-router/release/angular-ui-router',
        'angular-resource': 'frontend/bower_components/angular-resource/angular-resource.min',
        'angular-ui-router-styles': 'frontend/bower_components/angular-ui-router-styles/ui-router-styles',
        'satellizer': 'frontend/bower_components/satellizer/dist/satellizer.min',
        'angular-environments': 'frontend/bower_components/angular-environment/dist/angular-environment.min',
        'angular-validation': 'frontend/bower_components/jpkleemans-angular-validate/src/angular-validate',
        'angular-permission': 'frontend/bower_components/angular-permission/dist/angular-permission.min',
        'bootstrap': 'frontend/bower_components/bootstrap/dist/js/bootstrap',
        'angular-datatables': 'frontend/bower_components/angular-datatables/dist/angular-datatables.min',
        'angular-bootstrap': 'frontend/bower_components/angular-bootstrap/ui-bootstrap-tpls',
         'angular-datatables-bootstrap': 'frontend/bower_components/angular-datatables/dist/plugins/bootstrap/angular-datatables.bootstrap.min',
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
        },
        'satellizer': {
            deps: ['angular']
        },
        'angular-environments': {
            deps: ['angular']
        },
        'angular-validation': {
            exports: 'angular-validation',
            deps: ['angular', 'jquery-validation'],
        },
        'angular-permission': {
            deps: ['angular']
        },
        'bootstrap': {
            exports: 'bootstrap',
            deps: ['jquery'],
        },
        'angular-datatables': {
            exports: 'angular-datatables',
            deps: ['jquery-datatables','angular'],
        },
        'angular-bootstrap': {
            exports: 'angular-bootstrap',
            deps: ['angular'],
        }
    },
    deps: ['app']
});