<?php

namespace Cie\Policies;

use Cie\Models\User;
use Cie\Models\PatientUser;
use Illuminate\Auth\Access\HandlesAuthorization;

class PatientUserPolicy
{
    use HandlesAuthorization;

    public function before(User $user)
    {
        if ($user->hasRole('admin')) {
            return true;
        }
    }

    /**
     * Determine whether the user can view the patientUser.
     *
     * @param  \Cie\User  $user
     * @param  \Cie\Models\PatientUser  $patientUser
     * @return mixed
     */
    public function view(User $user, PatientUser $patientUser)
    {
        if($user->hasAnyRole('any') ) {
            return true;
        }
    }

    /**
     * Determine whether the user can create patientUsers.
     *
     * @param  \Cie\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        if($user->hasAnyRole( ['dirTerapia','jefapsi','asisjefatura','recepcion'] ) ) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can update the patientUser.
     *
     * @param  \Cie\User  $user
     * @param  \Cie\Models\PatientUser  $patientUser
     * @return mixed
     */
    public function update(User $user, PatientUser $patientUser)
    {
        if($user->hasRole('dirTerapia')) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can delete the patientUser.
     *
     * @param  \Cie\User  $user
     * @param  \Cie\Models\PatientUser  $patientUser
     * @return mixed
     */
    public function delete(User $user, PatientUser $patientUser)
    {
        if($user->hasRole('dirTerapia')) {
            return true;
        }

        return false;
    }
}
