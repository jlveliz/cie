<?php

namespace Cie\Models;

// use Illuminate\Database\Eloquent\Model;

class Request extends BaseModel
{
    protected $table = "request";

    protected $primaryKey = "id";

   
    protected $fillable = [
    	'begin_date',
        'end_date',
        'status'
    ];

    const STATENDIDO = "A";

    const STINGRESADO = "I";
}