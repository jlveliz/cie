<?php

namespace Cie\Models;

use  Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use Auth;

class PhysicalAssessment extends Model
{
    use SoftDeletes;

    protected $table = "physical_assessment";

    protected $primaryKey = "id";

   	protected $casts = [
        'patient_user_id' => 'int',
        'user_created_id' => 'int',
        'cephalic_control' => 'int'
    ];

    protected $with = [
        'creator'
    ];

    protected $fillable = [
    	'patient_user_id',
    	'user_created_id',
    	'date_eval',
    	'position',
		'muscular_tone',
		'cephalic_control',
		'superior_members_observation',
		'lower_limbs_observation',
		'march',
		'observation',
		'trunk',
    ];

    public function creator () {
        return $this->belongsTo('Cie\Models\User','user_created_id');
    }

    public static function boot () {
        parent::boot();

        static::creating(function($form){
            $form->created_user_id = Auth::user()->id;
        });
    }
}
