<?php

namespace Cie\Models;

use Illuminate\Database\Eloquent\Model;
use Cie\Scope\PatientUserScope;
use Auth;

class PatientUser extends Model
{
    protected $table = "patient_user";

    protected $primaryKey = "id";

    protected $with = ['father','mother','representant','user'];

    protected $fillable = [
    	'person_id',
    	'conadis_id',
    	'physical_disability',
    	'visual_disability',
    	'intellectual_disability',
        'hearing_disability',
        'psychosocial_disability',
        'grade_of_disability',
        'has_diagnostic',
        'diagnostic_id',
        'entity_send_diagnostic',
        'assist_other_therapeutic_center',
        'therapeutic_center_name',
        'has_insurance',
        'receives_medical_attention',
        'name_medical_attention',
        'schooling',
        'schooling_type',
        'schooling_name',
        'user_live_with',
        'parent_status_civil',
        'observation',
        'father_id',
        'mother_id',
        'representant_id',
        'other_diagnostic'
    ];


    public function person()
    {
        return $this->belongsTo('Cie\Models\Person','person_id');
    }

    public function father()
    {
        return $this->belongsTo('Cie\Models\Person','father_id');
    }

    public function mother()
    {
        return $this->belongsTo('Cie\Models\Person','mother_id');
    }

    public function representant()
    {
    	return $this->belongsTo('Cie\Models\Person','representant_id');
    }

    public function user()
    {
        return $this->belongsTo('Cie\Models\User','created_user_id');
    }



   


    public static function boot()
    {
        parent::boot();
        static::saving(function($pUser){
            $pUser->created_user_id = Auth::user()->id;
        });

        static::deleted(function($pUser){
            $pUser->person()->delete();
        });

        static::addGlobalScope(new PatientUserScope());

    }
}
