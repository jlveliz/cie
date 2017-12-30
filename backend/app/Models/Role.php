<?php

namespace Cie\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $table = "role";

    protected $primaryKey = "id";

    protected $fillable = [
    	'name',
    	'description'
    ];

    public function permissions()
    {
    	return $this->belongsToMany('Cie\Models\Permission','permission_id');
    }
}
