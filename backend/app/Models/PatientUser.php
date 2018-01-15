<?php

namespace Cie\Models;

use Illuminate\Database\Eloquent\Model;

class PatientUser extends Model
{
    protected $table = "patient_user";

    protected $primaryKey = "id";

    protected $with = ['person','parent','father','mother','representant','user'];

    protected $fillable = [
    	'person_id',
    	'num_identification',
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
        'schooling_name',
        'user_live_with',
        'parent_status_civil',
        'observation',
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
        return $this->belongsTo('Cie\Models\Person','father_id');
    }

    public function representant()
    {
    	return $this->belongsTo('Cie\Models\Person','representant_id');
    }

    public function user()
    {
        return $this->belongsTo('Cie\Models\User','created_user_id');
    }
}
