<?php

namespace Cie\Models;

// use Illuminate\Database\Eloquent\Model;

class Holiday extends BaseModel
{
    protected $table = "holiday";

    protected $primaryKey = "id";

    protected $fillable = [
    	'year',
        'date',
        'description'
    ];

}
