<?php

namespace Cie\Models;

use Illuminate\Database\Eloquent\Model;

class Pathology extends Model
{
    protected $table = "pathology";

    protected $primaryKey = "id";

    protected $fillable = [
    	'name',
        'cie_ten',
    ];
}
