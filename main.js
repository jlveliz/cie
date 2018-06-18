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
        'angular-moment': 'frontend/bower_components/angular-moment/angular-moment.min',
        'angular-animate': 'frontend/bower_components/angular-animate/angular-animate',
        'angular-messages': 'frontend/bower_components/angular-messages/angular-messages.min',
        'angular-aria': 'frontend/bower_components/angular-aria/angular-aria.min',
        'angular-material': 'frontend/bower_components/angular-material/angular-material',
        'moment': 'frontend/bower_components/moment/min/moment-with-locales',
        'underscore': 'frontend/bower_components/underscore/underscore-min',
        'pdfmake': 'frontend/bower_components/pdfmake/build/pdfmake.min',
        'vfs_fonts': 'frontend/assets/js/pdfmake/vfs_fonts',
        'base64': 'frontend/assets/js/base64/base64_utf8',
        // 'dropzone': 'frontend/assets/js/dropzone/dropzone-amd-module',
        // 'ng-dropzone': 'frontend/bower_components/ng-dropzone/dist/ng-dropzone',
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
            exports: 'angularUiRouter',
            deps: ['angular']
        },
        'angular-resource': {
            exports: 'angularResource',
            deps: ['angular'],
        },
        'angular-ui-router-styles': {
            exports:'angularUiRouterStyles',
            deps: ['angular']
        },
        'satellizer': {
            deps: ['angular']
        },
        'angular-environments': {
            exports:'angularEnvironments',
            deps: ['angular']
        },
        'angular-validation': {
            exports: 'angularValidation',
            deps: ['angular', 'jquery-validation'],
        },
        'angular-permission': {
             exports: 'angularPermission',
            deps: ['angular']
        },
        'bootstrap': {
            exports: 'bootstrap',
            deps: ['jquery'],
        },
        'angular-datatables': {
            exports: 'angularDatatables',
            deps: ['jquery-datatables', 'angular'],
        },
        'angular-bootstrap': {
            exports: 'angularBootstrap',
            deps: ['angular'],
        },
        'angular-datatables-bootstrap': {
            exports: 'angularDatatablesBootstrap',
            deps: ['angular-datatables'],
        },
        'moment': {
            exports: 'moment',
            deps: ['jquery'],
        },
        'underscore': {
            exports: 'underscore',
            deps: ['jquery'],
        },
        'angular-messages': {
            exports: 'angular-messages',
            deps: ['angular'],
        },
        'angular-animate': {
            exports: 'angular-animate',
            deps: ['angular'],
        },
        'angular-aria': {
            exports: 'angular-aria',
            deps: ['angular'],
        },
        'angular-material': {
            exports: 'angularMaterial',
            deps: ['angular-animate', 'angular-aria', 'angular-messages'],
        },
        'pdfmake': {
            exports: 'pdfmake',
            deps: ['jquery'],
        },
        'vfs_fonts': {
            exports: 'vfs_fonts',
            deps: ['pdfmake'],
        },
        'base64': {
            exports: 'base64',
            deps: ['jquery']

        }
    },
    deps: ['app']
});