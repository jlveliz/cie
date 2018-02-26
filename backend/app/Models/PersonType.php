<?php

namespace Cie\Models;

class PersonType extends BaseModel
{
    protected $table = "person_type";

    protected $primaryKey = "id";

    protected $fillable = [
    	'name',
    	'code'
    ];

    protected $no_uppercase = [
    	'code'
    ];

    public static function boot()
    {
        $istance = new Static;
        parent::boot();
        static::saving(function($personType) use($istance){
            $personType->code =  str_slug($personType->name);
        });

        static::updating(function($personType) use($istance) {
            $personType->code =  str_slug($personType->name);
        });
    }
}
