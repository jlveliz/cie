<?php

namespace Cie\Listeners;

use  Cie\Events\PatientUserFormCreated;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Carbon\Carbon;
use Redis;

class NotificatePatientUserEntered
{
    
    private $channel = "puser-form";
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  PatientUserFormCreated  $event
     * @return void
     */
    public function handle(PatientUserFormCreated $pUserForm)
    {
        $redis = Redis::connection();
        $redis->publish($this->channel, json_encode($pUserForm));
    }
}
