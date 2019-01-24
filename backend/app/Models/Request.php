<?php

namespace Cie\Models;

// use Illuminate\Database\Eloquent\Model;

class Request extends BaseModel
{
    protected $table = "request";

    protected $primaryKey = "id";

    // protected $casts = [
    //     'num_identification_patient' => 'int',
    //     'num_identification_representant' => 'int'
    // ];

    protected $fillable = [
    	'name',
        'slug',
        'city_id'
    ];

    const STATENDIDO = "A";

    const STINGRESADO = "I";

    public function city()
    {
    	return $this->belongsTo('Cie\Models\City','city_id');
    }
}
