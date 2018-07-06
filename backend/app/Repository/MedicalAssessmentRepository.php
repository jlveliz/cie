<?php

namespace Cie\Repository;

use Cie\RepositoryInterface\MedicalAssessmentRepositoryInterface;
use Cie\Exceptions\MedicalAssessmentException;
use Cie\Models\MedicalAssessment;
use Cie\Models\PatientUser;

/**
  * 
  */
 class MedicalAssessmentRepository implements MedicalAssessmentRepositoryInterface
 {
 	
 	public function paginate()
	{
		return MedicalAssessment::paginate();
	}

	public function enum($params = null)
	{
		if ($params) {
			if(is_array($params)) {
				if(array_key_exists('num_identification', $params) && isset($params['num_identification'])) {
					$paUsers = $this->find($params);
					//USADO PARA LA BUSQUEDA DE USUARIOS EN EVALUACIONES PSICOLOGICA Y MÉDICA
				} elseif(array_key_exists('name', $params) && isset($params['name'])) {
					$paUsers = PatientUser::leftJoin('medical_assessment',function($join){
						$join->on('patient_user.id','=','medical_assessment.patient_user_id')->whereRaw('medical_assessment.deleted_at is null');
					})->where(function($query) use ($params){
						$query->where('person.name','like','%'.$params['name'].'%')->orWhere('person.last_name','like','%'.$params['name'].'%');
					})->whereNull('medical_assessment.id')->get();
					
					if(!count($paUsers))
						throw new MedicalAssessmentException(['title'=>'No se han encontrado el listado de usuarios','detail'=>'No se han encontrado usuarios con este criterio de busqueda o ya existe una entrevista médica creada. Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");
					

				}
			}
		} else {
			$paUsers = MedicalAssessment::get();
			if (!$paUsers) {
				throw new MedicalAssessmentException(['title'=>'No se han encontrado el listado de Entrevistas Médicas','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");
			}
		}
		return $paUsers;
	}

	public function find($field)
	{
		if (is_array($field)) {
			if (array_key_exists('patient_user_id', $field)) { 
				$paUser = MedicalAssessment::where('patient_user_id',$field['patient_user_id'])->first();
			}elseif (array_key_exists('num_identification', $field)) {
				//USADO PARA BUSCAR UNA EVALUACIÓN PSICOLÓGICA POR CÉDULA EN EL MODAL DE CREACIÓN Y EVALUACIÓN PSICOLOGICA
				$paUser = PatientUser::leftJoin('medical_assessment',function($join){
						$join->on('patient_user.id','=','medical_assessment.patient_user_id')->whereRaw('medical_assessment.deleted_at is null');
					})->where('person.num_identification',$field['num_identification'])->whereNull('medical_assessment.id')->first();
				
				if(!$paUser)
					throw new MedicalAssessmentException(['title'=>'No se han encontrado el listado de usuarios','detail'=>'No se han encontrado usuarios con este criterio de busqueda o ya existe una entrevista médica creada. Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");
			} else {
				throw new MedicalAssessmentException(['title'=>'No se puede buscar la entrevista médica','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");	
			}

		} elseif (is_string($field) || is_int($field)) {
			$paUser = MedicalAssessment::find($field);
		} else {
			throw new MedicalAssessmentException(['title'=>'No se puede buscar la Asistencia médica','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");	
		}

		if (!$paUser) throw new MedicalAssessmentException(['title'=>'No se puede buscar la Asistencia médica','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");	
		
		return $paUser;

	}


	public function save($data)
	{

		$assessment = new MedicalAssessment();
			
		$assessment->fill($data);

		if ($assessment->save()) {
			$key = $assessment->getKey();
			return $this->find($key);
		} else {
			throw new MedicalAssessmentException(['title'=>'Ha ocurrido un error al guardar la Entrevista médica de '.$data['name'],'detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
		}
			
		
	}

	public function edit($id,$data)
	{
		$assessment = $this->find($id);
		
		if ($assessment) {

			$assessment->fill($data);
			if($assessment->update()){
				$key = $assessment->getKey();
				return $this->find($key);
			} else {
				throw new MedicalAssessmentException(['title'=>'Ha ocurrido un error al guardar la Entrevista médica de '.$data['patient_user_id'],'detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
			}
		} else {
			throw new MedicalAssessmentException(['title'=>'Ha ocurrido un error al guardar la Entrevista médica de '.$data['patient_user_id'],'detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
		}
		 


	}

	public function remove($id)
	{
		
		$assessment = $this->find($id);
		if ($assessment) {
			$assessment->delete();
			return true;
		}
		throw new PsychologicalAssessmentException(['title'=>'Ha ocurrido un error al eliminar la Entrevista médica ','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
	}

 } 