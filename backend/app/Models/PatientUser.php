<?php

namespace Cie\Models;

// use Illuminate\Database\Eloquent\Model;
use  Illuminate\Database\Eloquent\SoftDeletes;
use Cie\Scope\PatientUserScope;
use Auth;

class PatientUser extends BaseModel
{
    
    use SoftDeletes;

    const STATEREGISTRED = 1;

    protected $table = "patient_user";

    protected $primaryKey = "id";

      /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];

    
    /**
        DATA DUMMY
    **/

    private  $insurances = [
        [ 'id'=>1, 'value'=>'IESS' ],
        [ 'id'=>2, 'value'=>'Seguro Particular' ],
        [ 'id'=>3, 'value'=>'Otros' ],
        [ 'id'=>4, 'value'=>'No tiene Seguro' ],
    ];

    private $medicalAttentions = [
        ['id' => 1, 'value' => 'Seguro Particular'],
        ['id' => 2, 'value' => 'IESS'],
        ['id' => 3, 'value' => 'ISFA'],
        ['id' => 4, 'value' => 'MSP'],
        ['id' => 5, 'value' => 'Fundaciones'],
        ['id' => 6, 'value' => 'Dispensarios Médicos'],
        ['id' => 7, 'value' => 'Junta de Beneficiencia'],
        ['id' => 8, 'value' => 'Otros'],
    ];

    private $schoolings = [
        ['id' => 1,'value' => 'Regular'],
        ['id' => 2,'value' => 'Especial'],
        ['id' => 3,'value' => 'No Posee'],
    ];

    private $schoolingTypes = [
        ['id' => 1, 'value' => 'Fiscal'],
        ['id' => 2, 'value' => 'Particular'],
        ['id' => 3, 'value' => 'Fiscomisional'],
        ['id' => 4, 'value' => 'Otros'],
    ];



    protected $with = [
        'father',
        'mother',
        'representant',
        'province',
        'city',
        'parish',
        'diagnostic',
        'attached',
    ];

    protected $no_uppercase = [
        'grade_of_disability_id',
    ];

    protected $casts = [
        'date_birth' => 'date',
        'date_admission' => 'date',
        'person_id' => 'int',
        'physical_disability' => 'int',
        'visual_disability' => 'int',
        'intellectual_disability' => 'int',
        'hearing_disability' => 'int',
        'psychosocial_disability' => 'int',
        'language_disability' => 'int',
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
        'state_id' => 'int',
        'has_father' => 'int',
        'has_mother' => 'int',
        'grade_of_disability_id' => 'int'
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
        'language_disability',
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
        'grade_of_disability_id'
    ];


    public function historical()
    {
        return $this->hasmany('Cie\Models\Historical\HistoricalPatientUser','patient_user_id');
    }

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

    public function creator()
    {
        return $this->belongsTo('Cie\Models\User','created_user_id');
    }

    public function diagnostic()
    {
        return $this->belongsTo('Cie\Models\Pathology','diagnostic_id');
    }

    public function attached()
    {
        return $this->hasOne('Cie\Models\PatienUserAttached','patient_user_id');
    }

    public function gradeDisability()
    {
        return $this->belongsTo('Cie\Models\GradeOfDisability','grade_of_disability_id');
    }


    //FUNCIONES
    public function hasAllDocumentAttached()
    {
        $attached = $this->attached;
        if ($attached->representant_identification_card && $attached->user_identification_card && $attached->conadis_identification_card && $attached->specialist_certificate) {
            return true;
        }

        return false;
    }


    // public function getGradeDisability()
    // {
    //     $grade = null;
    //     foreach ($this->gradeDisability as $key => $value) {
    //         if ($value['id'] == $this->grade_of_disability_id) $grade = $value['value'];
    //     }
    //     return $grade;
    // }


    public function getHasTypeInsurance()
    {
        $type = null;
        foreach ($this->insurances as $key => $value) {
            if ($value['id'] == $this->has_insurance) $type = $value['value'];
        }
        return $type;
    }

    public function getNameMedicalAttention()
    {
        $medicalAte = null;
        foreach($this->medicalAttentions as $key => $value ) {
            if ($value['id'] == $this->receives_medical_attention) $medicalAte = $value['value'];
        }
        return $medicalAte;
    }

    public function getHasSchooling()
    {
        $schooling = null;
        foreach($this->schoolings as $key => $value) {
            if ($value['id'] == $this->schooling) $schooling = $value['value'];
        }     
        return $schooling;
    }

    public function getHasSchoolingType()
    {
        $schoolingType = '';
        foreach($this->schoolingTypes as $key => $value) {
            if ($value['id'] == $this->schooling_type) $schoolingType = $value['value'];
        }
        return $schoolingType;
    }

   


    public static function boot()
    {
        parent::boot();
        static::creating(function($pUser){
            // $puser->state_id =  self::STATEREGISTRED;
            $pUser->created_user_id = Auth::user() ? Auth::user()->id : 1;
        });

        static::deleted(function($pUser){
            $pUser->person()->delete();
            $pUser->attached()->delete();
        });

        static::addGlobalScope(new PatientUserScope());

    }

    public function setDateAdmissionAttribute($value)
    {
        $this->attributes['date_admission'] = date('Y-m-d',strtotime($value));
    }




}
