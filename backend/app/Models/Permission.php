<?php

namespace Cie\Models;

// use Illuminate\Database\Eloquent\Model;

class Permission extends BaseModel
{
    protected $table = "permission";

    protected $with = ['module','type','parent'];

    protected $primaryKey = "id";

    protected $no_uppercase = [
        'code',
        'resource',
        'fav_icon'
    ];

    protected $casts = [
        'module_id' => 'int',
        'parent_id' => 'int',
        'type_id' => 'int',
    ];

    protected $fillable = [
    	'name',
    	'module_id',
    	'parent_id',
    	'type_id',
    	'resource',
    	'description',
        'fav_icon',
        'order',
        'code'
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

    public function children()
    {
       return $this->hasMany('Cie\Models\Permission','parent_id','id');
    }

    public function roles()
    {
        return $this->belongsToMany('Cie\Models\Role','role_id');
    }

    public static function boot()
    {
        $istance = new Static;
        parent::boot();
        static::saving(function($permission) use($istance){
            $permission->code =  $istance->removeAccent($permission->name);
        });

        static::updating(function($permission) use($istance) {
            $permission->code =  $istance->removeAccent($permission->name);
        });
    }

    
}
