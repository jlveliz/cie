<?php
namespace Cie\Scope;

use Illuminate\Database\Eloquent\Scope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

/**
* 
*/
class PatientUserScope Implements Scope
{

	public function apply(Builder $builder, Model $model)
	{
		$builder->addSelect(
			'patient_user.*',
			'person.person_type_id',
        	'person.num_identification',
    		'person.name',
    		'person.last_name',
    		'person.email',
    		'person.genre',
    		'person.date_birth',
        	'person.province_id',
        	'person.city_id',
        	'person.parish_id',
        	'person.age',
        	'person.address')
		->join('person','person.id','=','patient_user.person_id');
	}

}