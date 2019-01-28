<?php

namespace Cie\Models;

// use Illuminate\Database\Eloquent\Model;

class BuildingTherapy extends BaseModel
{
    protected $table = "building_therapy";

    protected $primaryKey = "id";

    protected $fillable = [
    	'therapy_id',
        'build_id',
        'key_day',
        'capacity',
        'availability',
        'schedule',
    ];

    public function building() {
        return $this->betongsTo('Cie\Models\Building','build_id');
    }
    
    public function therapy() {
        return $this->betongsTo('Cie\Models\Therapy','therapy_id');
    }
}
