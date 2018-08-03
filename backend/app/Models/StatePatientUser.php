<?php

namespace Cie\Models;

// use Illuminate\Database\Eloquent\Model;

class StatePatientUser extends BaseModel
{
    protected $table = "state_patient_user";

    protected $primaryKey = "id";

    protected $no_uppercase = [
        'code'
    ];

    protected $fillable = [
    	'name',
        'code'
    ];

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
