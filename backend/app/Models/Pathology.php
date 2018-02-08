<?php

namespace Cie\Models;

// use Illuminate\Database\Eloquent\Model;

class Pathology extends BaseModel
{
    protected $table = "pathology";

    protected $primaryKey = "id";

    protected $fillable = [
    	'name',
    ];
}
