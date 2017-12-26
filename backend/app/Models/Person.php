<?php

namespace Cie\Models;

use Illuminate\Database\Eloquent\Model;

class Person extends Model
{
    protected $table = "person";

    protected $primaryKey = "id";

    protected $fillable = [
    	'person_type_id',
    	'name',
    	'last_name',
    	'email',
    	'genre',
    	'date_birth'
    ];

    public function user()
    {
    	return $this->hasOne('Cie\Models\User','person_id');
    }
}
