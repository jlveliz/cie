<?php

namespace Cie\Models;

use  Illuminate\Database\Eloquent\SoftDeletes;

class Therapy extends BaseModel
{
    protected $table = "therapy";

    protected $dates = ['deleted_at'];

    protected $with = ['type'];

    protected $primaryKey = "id";

    // protected $casts = [
    //     'schedule' => 'array',
    // ];

    protected $fillable = [
    	'name',
        'code',
        'description',
        'image',
        'type_therapy_id'
    ];

    public function type() {
        return $this->belongsTo('Cie\Models\TypeTherapy','type_therapy_id');
    }
}
