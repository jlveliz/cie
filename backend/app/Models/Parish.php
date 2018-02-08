<?php

namespace Cie\Models;

use Illuminate\Database\Eloquent\Model;

class Parish extends Model
{
    protected $table = "parish";

    protected $primaryKey = "id";

    protected $with = 'city';

     protected $casts = [
        'city_id' => 'int',
    ];

    protected $fillable = [
    	'name',
        'slug',
        'city_id'
    ];

    public function city()
    {
    	return $this->belongsTo('Cie\Models\City','city_id');
    }
}
