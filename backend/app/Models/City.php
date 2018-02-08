<?php

namespace Cie\Models;

// use Illuminate\Database\Eloquent\Model;

class City extends BaseModel
{
    protected $table = "city";

    protected $primaryKey = "id";

    protected $with = "province";

    protected $casts = [
        'province_id' => 'int',
    ];

    protected $fillable = [
    	'name',
        'slug',
        'province_id'
    ];

    public function province()
    {
    	return $this->belongsTo('Cie\Models\Province','province_id');
    }


    public static function boot()
    {
        parent::boot();
        static::saving(function($city){
            $city->slug = str_slug($city->name,'-');
        });
    }
}
