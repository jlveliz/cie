<?php

namespace Cie\Models;

// use Illuminate\Database\Eloquent\Model;

class Carousel extends BaseModel
{
    protected $table = "carousel";

    protected $primaryKey = "id";

    protected $casts = [
        'id' => 'int'
    ];

    protected $fillable = [
    	'name',
    	'id'
    ];

}
