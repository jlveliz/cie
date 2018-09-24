<?php

namespace Cie\Providers;

use Illuminate\Support\Facades\Event;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        'Cie\Events\SomeEvent' => [
            'Cie\Listeners\EventListener',
        ],
        'Illuminate\Auth\Events\Login' => [
            'Cie\Listeners\RegisterLastLogin'
        ],
        'Cie\Events\PatientUserFormCreated' => [
            'Cie\Listeners\NotificatePatientUserEntered'
        ]
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        parent::boot();

        //
    }
}
