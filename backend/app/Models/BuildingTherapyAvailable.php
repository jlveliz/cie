<?php

namespace Cie\Models;

// use Illuminate\Database\Eloquent\Model;

class BuildingTherapyAvailable extends BaseModel
{
    protected $table = "building_therapy_available";

    protected $primaryKey = "building_therapy_id";

    // protected $with = ['therapy'];

    protected $fillable = [
    	'building_therapy_id',
        'year',
        'grouptime_id',
        'timeframe_id',
        'avalability',
    ];


    protected $casts = [
        'avalability' => 'int'
    ];

    public function buildingTherapy() {
        return $this->betongsTo('Cie\Models\BuildingTherapy','building_therapy_id');
    }
}
