<?php

namespace Cie\Models;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable;

    protected $table = "user";

    protected $with = ["person",'roles','permissions'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'person_id', 'username', 'password','permission','super_admin'
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

    public function roles()
    {
        return $this->belongsToMany('Cie\Models\Role','user_role','user_id','role_id');
    }

    public function permissions()
    {
        return $this->hasMany('Cie\Models\UserPermission','user_id');
    }

    protected static function boot()
    {
        parent::boot();
        static::deleted(function($user){
            $user->person()->delete();
        });
    }
}
