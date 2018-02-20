<?php

namespace Cie\Models;

// use Illuminate\Database\Eloquent\Model;

class PermissionType extends BaseModel
{
    protected $table = "permission_type";

    protected $primaryKey = "id";

    protected $no_uppercase = [
        'code',
    ];

    protected $fillable = [
    	'name',
    	'code'
    ];


    public function permissions()
    {
    	return $this->hasMany('Cie\Models\Permission','type_id');
    }
}
