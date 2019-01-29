<?php

namespace Cie\Models;

// use Illuminate\Database\Eloquent\Model;

class Building extends BaseModel
{
    protected $table = "building";

    protected $primaryKey = "id";

    protected $with = [
        'therapies',
    ];

    protected $fillable = [
    	'name',
        'schedule',
    ];

    public function therapies() {
        return $this->hasMany('Cie\Models\BuildingTherapy','build_id');   
    }

    public function setScheduleAttribute($data) {
        $this->attributes['schedule'] = serialize($data);
    }
    
    public function getScheduleAttribute() {
        return  unserialize( $this->attributes['schedule'] );
    }
}
