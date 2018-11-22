<?php

namespace Cie\Models;

use  Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use Auth;

class PhysicalAssessment extends Model
{
    use SoftDeletes;

    protected $table = "physical_assessment";

    protected $primaryKey = "id";

   	protected $casts = [
        'patient_user_id' => 'int',
        'user_created_id' => 'int',
        'cephalic_control' => 'int'
    ];

    protected $with = [
        'patientUser',
        'creator'
    ];

    protected $fillable = [
    	'patient_user_id',
    	'user_created_id',
    	'date_eval',
    	'position',
        'muscular_tone_general',
		'muscular_tone',
		'cephalic_control',
		'superior_members_observation',
		'lower_members_observation',
		'march',
		'observation',
		'trunk',
        'column',
    ];

    public function creator () {
        return $this->belongsTo('Cie\Models\User','user_created_id');
    }

    public function patientUser()
    {
        return $this->belongsTo('Cie\Models\PatientUser','patient_user_id');
    }

    public static function boot () {
        parent::boot();

        static::creating(function($form){
            $form->user_created_id = Auth::user()->id;
        });
    }

    //Tono muscular
    public function setMuscularToneAttribute($value)
    {
        $this->attributes['muscular_tone'] = json_encode($value);
    }

    public function getMuscularToneAttribute($value)
    {
        return json_decode($value);
    }

    //Tono muscular General
    public function setMuscularToneGeneralAttribute($value)
    {
        $this->attributes['muscular_tone_general'] = json_encode($value);
    }

    public function getMuscularToneGeneralAttribute($value)
    {
        return json_decode($value);
    }

    //posición
    public function setPositionAttribute($value)
    {
        $this->attributes['position'] = json_encode($value);
    }

    public function getPositionAttribute($value)
    {
        return json_decode($value);
    }

    //Columna
    public function setColumnAttribute($value)
    {
        $this->attributes['column'] = json_encode($value);
    }

    public function getColumnAttribute($value)
    {
        return json_decode($value);
    }
}
