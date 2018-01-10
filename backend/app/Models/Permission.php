<?php

namespace Cie\Models;

use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    protected $table = "permission";

    protected $with = ['module','type','parent'];

    protected $primaryKey = "id";

    protected $fillable = [
    	'name',
    	'module_id',
    	'parent_id',
    	'type_id',
    	'resource',
    	'description',
        'fav_icon',
        'order'
    ];


    public function module()
    {
        return $this->belongsTo('Cie\Models\Module','module_id');
    }

    public function parent()
    {
        return $this->belongsTo('Cie\Models\Permission','parent_id');
    }

    public function type()
    {
    	return $this->belongsTo('Cie\Models\PermissionType','type_id');
    }

    public function roles()
    {
        return $this->belongsToMany('Cie\Models\Role','role_id');
    }

    public static function boot()
    {
        parent::boot();
        static::creating(function($permission){
            
            // $modulePer = $permission->module_id;

        });
    }
}
