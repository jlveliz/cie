<?php

namespace Cie\Models;


class PatienUserAttached extends BaseModel
{
    protected $table = "patient_user_attached";

    protected $primaryKey = "id";

    protected $fillable = [
    	'patient_user_id',
    	'representant_identification_card',
    	'user_identification_card',
    	'conadis_identification_card',
    	'specialist_certificate'
    ];



    public function patient()
    {
    	return $this->belongsTo('Cie\Models\PatientUser','patient_user_id');
    }


}
