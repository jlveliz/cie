<?php

namespace Cie\Models;

// use Illuminate\Database\Eloquent\Model;

class Province extends BaseModel
{
    protected $table = "province";

    protected $primaryKey = "id";

    protected $fillable = [
    	'name',
        'slug'
    ];
}
