<?php

namespace Cie\Models;

class TypeTherapy extends BaseModel
{
    protected $table = "type_therapy";

    protected $primaryKey = "id";

    // protected $casts = [
    //     'schedule' => 'array',
    // ];

    protected $fillable = [
    	'name',
        'code',
    ];
}
