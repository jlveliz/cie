<?php

namespace Cie\Listeners;

use  Cie\Events\PatientUserFormCreated;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Cie\Notifications\PuInscriptionCreated;
use Cie\Models\Role;
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
        
        //send notification to users
        $roles = Role::where('code','dr-val-medica')->orWhere('code','doc-val-psic')->get();
        foreach ($roles as $key => $role) {
            foreach ($role->users as $key => $user) {
                $user->notify(new PuInscriptionCreated($pUserForm));
            }
        }
        // $redis = Redis::connection();
        // $redis->publish($this->channel, json_encode($pUserForm));
    }
}
