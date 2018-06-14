<?php

namespace Cie\Models;

// use Illuminate\Database\Eloquent\Model;

class Module extends BaseModel
{
    protected $table = "module";

    protected $primaryKey = "id";

    protected $casts = [
        'order' => 'int'
    ];

    protected $fillable = [
    	'name',
    	'order'
    ];

    public function permissions()
    {
    	return $this->hasMany('Cie\Models\Permission','module_id');
    }
}
