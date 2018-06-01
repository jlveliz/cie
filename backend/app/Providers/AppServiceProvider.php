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
        //Role
        $this->app->bind('Cie\RepositoryInterface\RoleRepositoryInterface','Cie\Repository\RoleRepository');
        //Patient
        $this->app->bind('Cie\RepositoryInterface\PatientUserRepositoryInterface','Cie\Repository\PatientUserRepository');
        //Province
        $this->app->bind('Cie\RepositoryInterface\ProvinceRepositoryInterface','Cie\Repository\ProvinceRepository');
        //CIty
        $this->app->bind('Cie\RepositoryInterface\CityRepositoryInterface','Cie\Repository\CityRepository');
        //Parish
        $this->app->bind('Cie\RepositoryInterface\ParishRepositoryInterface','Cie\Repository\ParishRepository');
        //Pathologies
        $this->app->bind('Cie\RepositoryInterface\PathologyRepositoryInterface','Cie\Repository\PathologyRepository');
        //Tipo de Persona
        $this->app->bind('Cie\RepositoryInterface\PersonTypeRepositoryInterface','Cie\Repository\PersonTypeRepository');
        //Tipo de Identificacion
        $this->app->bind('Cie\RepositoryInterface\IdentificationTypeRepositoryInterface','Cie\Repository\IdentificationTypeRepository'); 
        //Tipo de estado de usuario
        $this->app->bind('Cie\RepositoryInterface\StatePatientUserRepositoryInterface','Cie\Repository\StatePatientUserRepository');

        //Psycological Assessment
        $this->app->bind('Cie\RepositoryInterface\PsychologicalAssessmentRepositoryInterface','Cie\Repository\PsychologicalAssessmentRepository');
    }
}
