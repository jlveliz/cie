<?php

namespace Cie\Models;

use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    protected $table = "permission";

    protected $primaryKey = "id";

    protected $fillable = [
    	'name',
    	'module_id',
    	'parent_id',
    	'type',
    	'resource',
    	'description'
    ];


    public function Module()
    {
    	return $this->belongsTo('Cie\Models\Module','module_id');
    }
}
