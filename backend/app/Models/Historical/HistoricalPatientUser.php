<?php

namespace Cie\Models\Historical;

// use Illuminate\Database\Eloquent\Model;
use Cie\Scope\PatientUserScope;
use Cie\Models\BaseModel;
use Auth;

class HistoricalPatientUser extends BaseModel
{
    protected $table = "historical_patient_user";

    protected $primaryKey = "id";

    protected $with = ['father','mother','representant','user','province','city','parish','pathology'];

    protected $no_uppercase = [
        'grade_of_disability_id',
    ];

    protected $casts = [
        'patient_user_id' => 'int',
        'date_birth' => 'date',
        'date_admission' => 'date',
        'person_id' => 'int',
        'physical_disability' => 'int',
        'visual_disability' => 'int',
        'intellectual_disability' => 'int',
        'hearing_disability' => 'int',
        'psychosocial_disability' => 'int',
        'has_diagnostic' => 'int',
        'diagnostic_id' => 'int',
        'has_insurance' => 'int',
        'receives_medical_attention' => 'int',
        'schooling' => 'int',
        'schooling_type' => 'int',
        'user_live_with' => 'int',
        'father_id' => 'int',
        'mother_id' => 'int',
        'representant_id' => 'int',
        'created_user_id' => 'int',
        'parent_status_civil' => 'int',
        'province_id' => 'int',
        'city_id' => 'int',
        'parish_id' => 'int',
        'age' => 'int',
        'assist_other_therapeutic_center' => 'int',
        'state_id' => 'int',
        'has_father' => 'int',
        'has_mother' => 'int',
    ];

    protected $fillable = [
        'patient_user_id',
    	'person_id',
        'date_admission',
    	'conadis_id',
    	'physical_disability',
    	'visual_disability',
    	'intellectual_disability',
        'hearing_disability',
        'psychosocial_disability',
        'grade_of_disability_id',
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
        'other_diagnostic',
        'state_id',
        'has_father',
        'has_mother',
    ];


    // public function current()
    // {
    //     return $this->belongsTo('Cie\Models\PatientUser','id');
    // }

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

    public function province()
    {
        return $this->belongsTo('Cie\Models\Province','province_id');
    }

    public function city()
    {
        return $this->belongsTo('Cie\Models\City','city_id');
    }

    public function parish()
    {
        return $this->belongsTo('Cie\Models\Parish','parish_id');
    }

    public function user()
    {
        return $this->belongsTo('Cie\Models\User','created_user_id');
    }

    public function pathology()
    {
        return $this->belongsTo('Cie\Models\Pathology','diagnostic_id');
    }

   

   


    public static function boot()
    {
        parent::boot();
        static::creating(function($pUser){
            $pUser->created_user_id = Auth::user() ? Auth::user()->id : 1;
        });

        static::deleted(function($pUser){
            $pUser->person()->delete();
        });

        static::addGlobalScope(new PatientUserScope());

    }

    public function setDateAdmissionAttribute($value)
    {
        $this->attributes['date_admission'] = date('Y-m-d',strtotime($value));
    }
}
