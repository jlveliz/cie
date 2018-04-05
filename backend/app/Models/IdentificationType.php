<?php

namespace Cie\Models;

// use Illuminate\Database\Eloquent\Model;

class IdentificationType extends BaseModel
{
    protected $table = "identification_type";

    protected $primaryKey = "id";

    protected $fillable = [
    	'name',
        'code',
    ];

    protected $no_uppercase = [
        'code'
    ];

    public static function boot()
    {
        $istance = new Static;
        parent::boot();
        static::saving(function($identiTypes) use($istance){
            $identiTypes->code =  str_slug($identiTypes->name);
        });

        static::updating(function($identiTypes) use($istance) {
            $identiTypes->code =  str_slug($identiTypes->name);
        });
    }
}
