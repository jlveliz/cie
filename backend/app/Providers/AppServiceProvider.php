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
        //Grade of Disability
        $this->app->bind('Cie\RepositoryInterface\GradeOfDisabilityRepositoryInterface','Cie\Repository\GradeOfDisabilityRepository');
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

        //Medical Assessment
        $this->app->bind('Cie\RepositoryInterface\MedicalAssessmentRepositoryInterface','Cie\Repository\MedicalAssessmentRepository');

        //Physical Assessment
        $this->app->bind('Cie\RepositoryInterface\PhysicalAssessmentRepositoryInterface','Cie\Repository\PhysicalAssessmentRepository');
        
        //Carousel
        $this->app->bind('Cie\RepositoryInterface\CarouselRepositoryInterface','Cie\Repository\CarouselRepository');
        
        //Requests
        $this->app->bind('Cie\RepositoryInterface\RequestRepositoryInterface','Cie\Repository\RequestRepository');
        
        //Building
        $this->app->bind('Cie\RepositoryInterface\BuildingRepositoryInterface','Cie\Repository\BuildingRepository');
        
        //Therapy
        $this->app->bind('Cie\RepositoryInterface\TherapyRepositoryInterface','Cie\Repository\TherapyRepository');
       
        //Type Therapy
        $this->app->bind('Cie\RepositoryInterface\TypeTherapyRepositoryInterface','Cie\Repository\TypeTherapyRepository');
        
        //Building Therapy User
        $this->app->bind('Cie\RepositoryInterface\BuildingTherapyUserRepositoryInterface','Cie\Repository\BuildingTherapyUserRepository');

        //Building Therapy
        $this->app->bind('Cie\RepositoryInterface\BuildingTherapyRepositoryInterface','Cie\Repository\BuildingTherapyRepository');

        //Therpists 
        $this->app->bind('Cie\RepositoryInterface\TherapistRepositoryInterface','Cie\Repository\TherapistRepository');

        //Holidays 
        $this->app->bind('Cie\RepositoryInterface\HolidayRepositoryInterface','Cie\Repository\HolidayRepository');

        //Carousel 
        $this->app->bind('Cie\RepositoryInterface\CarouselRepositoryInterface','Cie\Repository\CarouselRepository');
        
    }
}
