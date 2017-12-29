<?php

namespace Cie\Models;

use Illuminate\Database\Eloquent\Model;

class PermissionType extends Model
{
    protected $table = "permission_type";

    protected $primaryKey = "id";

    protected $fillable = [
    	'name',
    ];


    public function permissions()
    {
    	return $this->hasMany('Cie\Models\Permission','type_id');
    }
}
