<?php

namespace Cie\Models;

use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    protected $table = "module";

    protected $primaryKey = "id";

    protected $fillable = [
    	'name',
    ];
}
