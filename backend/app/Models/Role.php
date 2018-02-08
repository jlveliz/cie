<?php

namespace Cie\Models;

// use Illuminate\Database\Eloquent\Model;

class Role extends BaseModel
{
    protected $table = "role";

    protected $primaryKey = "id";

    protected $fillable = [
    	'name',
        'code',
    	'description',
        'is_default'
    ];

    protected $with = ['permissions'] ;

    public function permissions()
    {
    	return $this->belongsToMany('Cie\Models\Permission','role_permission','role_id','permission_id');
    }

    public function getIsDefaultAttribute($value)
    {
        return (string)$value;
    }

    protected static function boot() {
        parent::boot();
        static::creating(function($role) { // before inserting update all items to default 1
            if ($role->is_default == 1) {
                $istance = new Static();
                $istance->where('is_default',\DB::raw(1))->update(['is_default'=>0]);
            }
        }); 

        static::updating(function($role) { // before inserting update all items to default 1
            if ($role->is_default == 1) {
                $istance = new Static();
                $istance->where('is_default',\DB::raw(1))->update(['is_default'=>0]);
            }
        });
    }
}
