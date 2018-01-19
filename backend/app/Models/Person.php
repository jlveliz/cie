<?php

namespace Cie\Models;

use Illuminate\Database\Eloquent\Model;

class Person extends Model
{
    protected $table = "person";

    protected $primaryKey = "id";

    private $male = "M";

    private $female = "F";

    protected $fillable = [
    	'person_type_id',
        'num_identification',
    	'name',
    	'last_name',
    	'email',
    	'genre',
    	'date_birth',
        'province_id',
        'city_id',
        'parish_id',
        'age',
        'address',
        'phone',
        'mobile',
        'activity',
        'has_facebook',
        'has_twitter',
        'has_instagram',
    ];

    public function province()
    {
        return $this->belongsTo('Cie\Models\Province','province_id');
    }

    public function city()
    {
        return $this->belongsTo('Cie\Models\City','city_id');
    }

    public function parish()
    {
    	return $this->belongsTo('Cie\Models\Parish','city_id');
    }

    public function getMale()
    {
        return $this->male;
    }

    public function getFemale()
    {
        return $this->female;
    }
}
