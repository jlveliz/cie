<?php

namespace Cie\Models;

// use Illuminate\Database\Eloquent\Model;
use  Illuminate\Database\Eloquent\SoftDeletes;


class Carousel extends BaseModel
{

    use SoftDeletes;

    protected $table = "carousel";

    protected $primaryKey = "id";

    protected $dates = ['deleted_at'];

    protected $casts = [
        'id' => 'int'
    ];

    protected $fillable = [
    	'name',
    	'description',
    	'image',
    	'url',
    	'show',
    	'status'
    ];

}
