<?php

namespace Cie\Models;

// use Illuminate\Database\Eloquent\Model;

class BuildingTherapy extends BaseModel
{
    protected $table = "building_therapy";

    protected $primaryKey = "id";

    protected $with = ['availables'];

    protected $fillable = [
    	'therapy_id',
        'build_id',
        'key_day',
        'capacity',
        'availability',
        'schedule',
    ];

    protected $casts = [
        'build_id' => 'int',
        'therapy_id' => 'int',
        'therapist_user_id' => 'int'
    ];

    public function building() {
        return $this->betongsTo('Cie\Models\Building','build_id');
    }
    
    public function therapy() {
        return $this->betongsTo('Cie\Models\Therapy','therapy_id');
    }

    public function availables() {
        return $this->hasMany('Cie\Models\BuildingTherapyAvailable','building_therapy_id');
    }


    public function setScheduleAttribute($data) {
        $this->attributes['schedule'] = serialize($data);
    }
    
    public function getScheduleAttribute() {
        return  unserialize( $this->attributes['schedule'] );
    }
}
