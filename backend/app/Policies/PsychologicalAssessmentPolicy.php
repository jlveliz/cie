<?php

namespace Cie\Policies;

use Cie\User;
use Cie\PsychologicalAssessment;
use Illuminate\Auth\Access\HandlesAuthorization;

class PsychologicalAssessmentPolicy
{
    use HandlesAuthorization;

    
    public function before(User $user)
    {
        if ($user->hasRole('admin')) {
            return true;
        }
    }

    /**
     * Determine whether the user can view the psychologicalAssessment.
     *
     * @param  \Cie\User  $user
     * @param  \Cie\PsychologicalAssessment  $psychologicalAssessment
     * @return mixed
     */
    public function view(User $user, PsychologicalAssessment $psychologicalAssessment)
    {
        if($user->hasAnyRole('any') ) {
            return true;
        }
    }

    /**
     * Determine whether the user can create psychologicalAssessments.
     *
     * @param  \Cie\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        if($user->hasAnyRole( ['dirTerapia','psicologia','tera-famil'] ) ) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can update the psychologicalAssessment.
     *
     * @param  \Cie\User  $user
     * @param  \Cie\PsychologicalAssessment  $psychologicalAssessment
     * @return mixed
     */
    public function update(User $user, PsychologicalAssessment $psychologicalAssessment)
    {
        if($user->hasAnyRole( ['dirTerapia'] ) ) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can delete the psychologicalAssessment.
     *
     * @param  \Cie\User  $user
     * @param  \Cie\PsychologicalAssessment  $psychologicalAssessment
     * @return mixed
     */
    public function delete(User $user, PsychologicalAssessment $psychologicalAssessment)
    {
        if($user->hasAnyRole( ['dirTerapia'] ) ) {
            return true;
        }

        return false;
    }
}
