<?php

namespace Cie\Models;

// use Illuminate\Database\Eloquent\Model;

class BuildingTherapyUser extends BaseModel
{
    protected $table = "building_therapy_user";

    protected $primaryKey = "id";

    protected $fillable = [
    	'patient_user_id',
        'year',
        'grouptime_id',
        'timeframe_id',
        'building_therapy_id',
        'start_date',
        'end_date',
    ];

    public function patientUser() {
        return $this->betongsTo('Cie\Models\PatientUser','patient_user_id');
    }

    public function building() {
        return $this->betongsTo('Cie\Models\Building','build_id');
    }
    
    public function therapy() {
        return $this->betongsTo('Cie\Models\Therapy','therapy_id');
    }
}
