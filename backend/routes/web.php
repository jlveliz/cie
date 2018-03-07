<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('test','ReportController@index');


Route::group(['prefix'=>'api'],function() {

	Route::group(['prefix'=>'authenticate'],function(){
		Route::post('login','Auth\LoginController@login');
		// Route::post('logout','Auth\AuthenticateController@logout');
		Route::get('verify','Auth\LoginController@verify');
		Route::get('refresh','Auth\LoginController@refresh');
	});


	Route::resource('users','UserController',['except'=>['create']]);
	Route::resource('modules','ModuleController',['except'=>['create']]);
	Route::resource('permissions','PermissionController',['except'=>['create']]);
	Route::resource('typepermissions','PermissionTypeController',['except'=>['create']]);
	Route::resource('roles','RoleController',['except'=>['create']]);
	Route::get('pUsers/getParent','PatientUserController@getParent');
	Route::resource('pUsers','PatientUserController',['except'=>['create']]);
	Route::resource('provinces','ProvinceController',['except'=>['create']]);
	Route::resource('cities','CityController',['except'=>['create']]);
	Route::resource('parishies','ParishController',['except'=>['create']]);
	Route::resource('pathologies','PathologyController',['except'=>['create']]);
	Route::resource('pertypes','PersonTypeController',['except'=>['create']]);

	Route::get('validator/{method}','HelperController@validation');
	Route::get('menu','HelperController@loadMenu');
});