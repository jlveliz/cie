<?php

namespace Cie\Models;

use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    protected $table = "city";

    protected $primaryKey = "id";

    protected $with = "province";

    protected $fillable = [
    	'name',
        'slug',
        'province_id'
    ];

    public function province()
    {
    	return $this->belongsTo('Cie\Models\Province','province_id');
    }
}
