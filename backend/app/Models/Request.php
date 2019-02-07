<?php

namespace Cie\Models;

// use Illuminate\Database\Eloquent\Model;

class Request extends BaseModel
{
    protected $table = "request";

    protected $primaryKey = "id";

    protected $casts = [
    	'representant_type' => 'int'
    ];

   
    protected $fillable = [
    	'begin_date',
        'end_date',
        'status'
    ];

    const STATENDIDO = "A";

    const STINGRESADO = "I";


    public static function boot()
    {
        // parent::boot();
        // static::updating(function($request){
        //     dd($request);
        // });
    }
}
