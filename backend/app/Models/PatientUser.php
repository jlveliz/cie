<?php

namespace Cie\Models;

// use Illuminate\Database\Eloquent\Model;
use Cie\Scope\PatientUserScope;
use Auth;

class PatientUser extends BaseModel
{
    protected $table = "patient_user";

    protected $primaryKey = "id";

    protected $with = ['father','mother','representant','user','province','city','parish','pathology'];

    protected $casts = [
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
    ];

    protected $fillable = [
    	'person_id',
        'date_admission',
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
        static::saving(function($pUser){
            $pUser->created_user_id = Auth::user()->id;
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
