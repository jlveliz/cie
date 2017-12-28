<?php

namespace Cie\Models;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable;

    protected $table = "user";

    protected $with = "person";

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'person_id', 'username', 'password','permission'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    public function person()
    {
        return $this->belongsTo('Cie\Models\Person','person_id');
    }

    protected static function boot()
    {
        parent::boot();
        static::deleted(function($user){
            $user->person()->delete();
        });
    }

    public function setPermissionAttribute($permissions)
    {
        $this->attributes['permission']  = serialize($permissions);
    }

     public function getPermissionAttribute($permissions)
    {
        return unserialize($permissions);
    }
}
