<?php

namespace Cie\Models;

use Illuminate\Database\Eloquent\Model;

class Parish extends Model
{
    protected $table = "parish";

    protected $primaryKey = "id";

    protected $fillable = [
    	'name',
        'slug',
        'city_id'
    ];
}
