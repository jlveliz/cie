<?php

namespace Cie\Models;

use Illuminate\Database\Eloquent\Model;

class UserPermission extends Model
{
    protected $table = "user_permission";

    protected $primaryKey = "id";

    public $timestamps = false;

    protected $fillable = [
    	'user_id',
        'permission_id',
    	'allow',
    ];
}
