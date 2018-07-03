<?php

namespace Cie\Models;

// use Illuminate\Database\Eloquent\Model;

class GradeOfDisability extends BaseModel
{
    protected $table = "grade_disability";

    protected $primaryKey = "id";

     protected $no_uppercase = [ 
     	'value'
     ];

    protected $casts = [
        'city_id' => 'int',
    ];

    protected $fillable = [
    	'name',
        'value'
    ];
}
