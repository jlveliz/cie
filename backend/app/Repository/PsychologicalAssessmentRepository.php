<?php
namespace Cie\Repository;

use Cie\RepositoryInterface\PsychologicalAssessmentRepositoryInterface;
use Cie\Exceptions\PsychologicalAssessmentException;
use Cie\Models\PsychologicalAssessment;


/**
* 
*/
class PsychologicalAssessmentRepository implements PsychologicalAssessmentRepositoryInterface
{
	
	
	public function paginate()
	{
		return PsychologicalAssessment::paginate();
	}

	public function enum($params = null)
	{
		$paUsers = PsychologicalAssessment::get();
		if (!$paUsers) {
			throw new PsychologicalAssessmentException(['title'=>'No se han encontrado el listado de Asistencia psicológica','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");
		}
		return $paUsers;
	}



	public function find($field)
	{
		if (is_array($field)) {
			if (array_key_exists('patient_user_id', $field)) { 
				$paUser = PsychologicalAssessment::where('patient_user_id',$field['patient_user_id'])->first();
			} else {
				throw new PsychologicalAssessmentException(['title'=>'No se puede buscar la Asistencia psicológica','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");	
			}

		} elseif (is_string($field) || is_int($field)) {
			$paUser = PsychologicalAssessment::where('patient_user_id',$field)->first();
		} else {
			throw new PsychologicalAssessmentException(['title'=>'No se puede buscar la Asistencia psicológica','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");	
		}

		if (!$paUser) throw new PsychologicalAssessmentException(['title'=>'No se puede buscar la Asistencia psicológica','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");	
		
		return $paUser;

	}

	public function save($data)
	{

		$assessment = new PsychologicalAssessment();
			
		$assessment->fill($data);

		if ($assessment->save()) {
			$key = $assessment->getKey();
			return $this->find($key);
		} else {
			throw new PsychologicalAssessmentException(['title'=>'Ha ocurrido un error al guardar la Asistencia psicológica de '.$data['patient_user_id'],'detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
		}
			
		
	}


	
	public function edit($id,$data)
	{
		$assessment = $this->find($id);
		
		if ($assessment) {

			$assessment->fill($data);
			if($assessment->update()){
				$key = $paUser->getKey();
				return $this->find($key);
			} else {
				throw new PsychologicalAssessmentException(['title'=>'Ha ocurrido un error al guardar la Asistencia psicológica de '.$data['patient_user_id'],'detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
			}
		} else {
			throw new PsychologicalAssessmentException(['title'=>'Ha ocurrido un error al guardar la Asistencia psicológica de '.$data['patient_user_id'],'detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
		}
		 


	}

	public function remove($id)
	{
		
		$assessment = $this->find($id);
		if ($assessment) {
			$assessment->delete();
			return true;
		}
		throw new PsychologicalAssessmentException(['title'=>'Ha ocurrido un error al eliminar la Asistencia psicológica ','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
	}
}