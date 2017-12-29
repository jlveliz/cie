<?php

namespace Cie\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //User
        $this->app->bind('Cie\RepositoryInterface\UserRepositoryInterface','Cie\Repository\UserRepository');
        //Module
        $this->app->bind('Cie\RepositoryInterface\ModuleRepositoryInterface','Cie\Repository\ModuleRepository');
        //Type Permission
        $this->app->bind('Cie\RepositoryInterface\PermissionTypeRepositoryInterface','Cie\Repository\PermissionTypeRepository');
        //Permission
        $this->app->bind('Cie\RepositoryInterface\PermissionRepositoryInterface','Cie\Repository\PermissionRepository');
    }
}
