<?php

namespace Cie\Models;

// use Illuminate\Database\Eloquent\Model;

class BuildingTherapyUser extends BaseModel
{
    protected $table = "building_therapy_user";

    protected $primaryKey = "id";

    protected $with = ['buildingTherapy'];
    
    protected $casts = [ 
        'patient_user_id' => 'int'
    ];

    protected $fillable = [
    	'patient_user_id',
        'year',
        'grouptime_id',
        'timeframe_id',
        'building_therapy_id',
        'start_date',
        'end_date',
    ];

    public function patient() {
        return $this->belongsTo('Cie\Models\PatientUser','patient_user_id');
    }

    

    public function buildingTherapy() {
        return $this->belongsTo('Cie\Models\BuildingTherapy','building_therapy_id');
    }


    
}
