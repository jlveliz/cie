<?php
namespace Cie\Repository;

use Cie\RepositoryInterface\PatientUserRepositoryInterface;
use Cie\Exceptions\PatientUserException;
use Cie\Models\PatientUser;
use Cie\Models\Person;

/**
* 
*/
class PatientUserRepository implements PatientUserRepositoryInterface
{
	
	public function enum($params = null)
	{
		$paUsers = PatientUser::all();

		if (!$paUsers) {
			throw new PatientUserException(['title'=>'No se han encontrado el listado de usuarios','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");
		}
		return $paUsers;
	}



	public function find($field)
	{
		if (is_array($field)) {
			if (array_key_exists('num_identification', $field)) { 
				$paUser = PatientUser::where('patient_user.num_identification',$field['num_identification'])->first();
			} elseif (array_key_exists('conadis_id', $field)) {
				$paUser = PatientUser::where('patient_user.conadis_id',$field['conadis_id'])->first();	
			} elseif (array_key_exists('person_id', $field)) {
				$paUser = PatientUser::where('patient_user.person_id',$field['person_id'])->first();	
			} else {
				throw new PatientUserException(['title'=>'No se puede buscar el Usuario','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");	
			}

		} elseif (is_string($field) || is_int($field)) {
			$paUser = PatientUser::where('patient_user.id',$field)->first();
		} else {
			throw new PatientUserException(['title'=>'Se ha producido un error al buscar el Usuario','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");	
		}

		if (!$paUser) throw new PatientUserException(['title'=>'No se puede buscar el Usuario','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");	
		
		return $paUser;

	}

	//TODO
	public function save($data)
	{
		
		//father
		$dataFather = $data['father'];
		$father = new Person();
		$dataFather['genre'] = $father->getMale();
		$father->fill($dataFather);
		if ($father->save()) {
			$fatherKey = $father->getKey();
			//mother
			$dataMother = $data['mother'];
			$mother = new Person();
			$dataMother['genre'] = $mother->getFemale();
			$mother->fill($dataMother);
			if ($mother->save()) {
				$motherKey = $mother->getKey();

				if (array_key_exists('is_representant', $data['father']) && $data['father']['is_representant'] == 1) {
					$representantId = $fatherKey;
				} elseif (array_key_exists('is_representant', $data['mother'])  && $data['mother']['is_representant'] == 1) {
					$representantId = $motherKey;
				} else {
					//representant
					$dataRepresentant = $data['representant'];
					$representant = new Person();
					$representant->fill($dataRepresentant);
					if($representant->save()){
						$representantId = $representant->getKey();
					}

				}

				//user patient
				$pUPerson = new Person();
				$pUPerson->fill($data);
				if ($pUPerson->save()) {
					$personKey = $pUPerson->getKey();
					$pUPatient = new PatientUser();
					$data['person_id'] = $personKey;
					$data['father_id'] = $fatherKey;
					$data['mother_id'] = $motherKey;
					$data['representant_id'] = $representantId;
					$pUPatient->fill($data);
					if($pUPatient->save()){
						$key = $pUPatient->getKey();
						return $this->find($key);
					} else {
						throw new PatientUserException(['title'=>'Ha ocurrido un error al guardar los datos del usuario '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
					}
				}
			} else{
				throw new PatientUserException(['title'=>'Ha ocurrido un error al guardar los datos de la madre del usuario '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
			}
		} else {
			throw new PatientUserException(['title'=>'Ha ocurrido un error al guardar los datos del padre del usuario '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
		}
	}

	public function edit($id,$data)
	{
		$paUser = $this->find($id);
		if ($paUser) {
			//father

			$paUser->father->update($data['father']);
			$fatherKey = $paUser->father->id;
			//mother
			$paUser->mother->update($data['mother']);
			$motherKey = $paUser->mother->id;
			
			//representant
			if (array_key_exists('is_representant', $data['father']) && $data['father']['is_representant'] == 1) {
				$representantId = $paUser->father->id;
			} elseif (array_key_exists('is_representant', $data['mother'])  && $data['mother']['is_representant'] == 1) {
				$representantId = $paUser->mother->id;
			} else {
				//representant
				//TODOO
				$existRepresentant = Person::where('num_identification',$data['representant']['num_identification'])->first();
				if ($existRepresentant) {
					//update person
					$existRepresentant->fill($data['representant'])->update();
					$representantId = $existRepresentant->id;
				} else {
					//create person
					$representant = new Person();
					$representant->fill($data['representant']);
					$representant->save();
					$representantId = $representant->getKey();
				}
				
			}
			$data['father_id'] = $fatherKey;
			$data['mother_id'] = $motherKey;
			$data['representant_id'] = $representantId;
			$paUser->person->update($data);
			$paUser->fill($data);
			if($paUser->update()){
				$key = $paUser->getKey();
				return $this->find($key);
			}
		} else {
			throw new PatientUserException(['title'=>'Ha ocurrido un error al actualizar la solicitud '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
		}


	}

	public function remove($id)
	{
		
		$paUser = $this->find($id);
		if ($paUser) {
			$paUser->delete();
			return true;
		}
		throw new PatientUserException(['title'=>'Ha ocurrido un error al eliminar el Paciente ','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
	}
}