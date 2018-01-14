<?php

namespace Cie\Models;

use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    protected $table = "city";

    protected $primaryKey = "id";

    protected $fillable = [
    	'name',
        'slug',
        'province_id'
    ];
}
