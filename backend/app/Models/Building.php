<?php

namespace Cie\Models;

// use Illuminate\Database\Eloquent\Model;

class Building extends BaseModel
{
    protected $table = "building";

    protected $primaryKey = "id";

    // protected $casts = [
    //     'schedule' => 'array',
    // ];

    protected $fillable = [
    	'name',
        'schedule',
    ];

    public function therapies() {
        return $this->belongsToMany('Cie\Models\Therapy','building_therapy','build_id','therapy_id');   
    }

    public function setScheduleAttribute($data) {
        $this->attributes['schedule'] = serialize($data);
    }
    
    public function getScheduleAttribute($data) {
        return  unserialize( $this->attributes['schedule'] );
    }
}
