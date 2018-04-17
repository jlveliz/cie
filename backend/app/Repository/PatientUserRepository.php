<?php
namespace Cie\Repository;

use Cie\RepositoryInterface\PatientUserRepositoryInterface;
use Cie\Exceptions\PatientUserException;
use Cie\Models\PatientUser;
use Cie\Models\Person;
use Cie\Models\PersonType;
use Cie\Models\IdentificationType;
use Cie\Models\Historical\HistoricalPatientUser;
use DB;

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
		
		$representantId = null;
		//father
		$fatherKey = null;
		//mother
		$motherKey = null;
		if (array_key_exists('has_father', $data) && $data['has_father'] == 1) {
			$dataFather = $data['father'];
			$dataFather['person_type_id'] = $this->getPersonType();
			$dataFather['identification_type_id'] = $this->getIdentification('cedula');
			//if exists father
			$father = Person::where('num_identification',$dataFather['num_identification'])->first();
			if(!$father) {
				$father = new Person();
				$dataFather['genre'] = $father->getMale();
			} 
			
			$father->fill($dataFather);

			if ($father->save()) {
				$fatherKey = $father->getKey();
				if (array_key_exists('is_representant', $data['father']) && $data['father']['is_representant'] == 1) {
					$representantId = $fatherKey; 
				}

			} else {
				throw new PatientUserException(['title'=>'Ha ocurrido un error al guardar los datos del padre del usuario '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
			}
		}

		
		if (array_key_exists('has_mother', $data) && $data['has_mother'] == 1) {
			$dataMother = $data['mother'];
			$dataMother['person_type_id'] = $this->getPersonType();
			$dataMother['identification_type_id'] = $this->getIdentification('cedula');
			$mother = Person::where('num_identification',$dataMother['num_identification'])->first();
			if (!$mother) {
				$mother = new Person();
				$dataMother['genre'] = $mother->getFemale();
			}
			$mother->fill($dataMother);

			if ($mother->save()) {
				$motherKey = $mother->getKey();
				if (array_key_exists('is_representant', $data['mother'])  && $data['mother']['is_representant'] == 1) {
					$representantId = $motherKey; 
				}
			} else {
				throw new PatientUserException(['title'=>'Ha ocurrido un error al guardar los datos de la madre del usuario '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
			}

		}

		
		
		//person representant
		if ( (array_key_exists('representant', $data) && $data['representant']) && (!$data['mother']['is_representant']  && !$data['father']['is_representant']) )  {
			$dataRepresentant = $data['representant'];
			$dataRepresentant['person_type_id'] = $this->getPersonType();
			$dataRepresentant['identification_type_id'] = $this->getIdentification('cedula');
			$representant = Person::where('num_identification',$dataRepresentant['num_identification'])->first();
			if(!$representant) {
				$representant = new Person();
			}


			$representant->fill($dataRepresentant);
			if($representant->save()){
				$representantId = $representant->getKey();
			} else {
				throw new PatientUserException(['title'=>'Ha ocurrido un error al guardar los datos del usuario '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
			}
		}

		

		//user patient
		$pUPerson = new Person();
		$pUPerson['person_type_id'] = $this->getPersonType();
		$pUPerson['identification_type_id'] = $this->getIdentification('cedula');
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
			
		
	}


	/**
		SAVE THE CURRENT RECORD ON THE TABLE ´historical_patient_user´ 
		AND UPDATE THE DATA WITH THE REQUEST
	**/
	public function edit($id,$data)
	{
		
		//father
		$fatherKey = null;
		$motherKey = null;
		$representantId = null;
		$paUser = $this->find($id);
		
		if ($paUser) {

			//save de last data on the historical
			$historical = new HistoricalPatientUser($paUser->toArray());
			$paUser->historical()->save($historical);

			//if exists father
			if (array_key_exists('has_father', $data) && $data['has_father'] == 1) {
				$dataFather = $data['father'];
				$dataFather['person_type_id'] = $this->getPersonType();
				$dataFather['identification_type_id'] = $this->getIdentification('cedula');
				$father = Person::where('num_identification',$dataFather['num_identification'])->first();
				if($father) {
					$paUser->father->update($dataFather);
				} else {
					$father = new Person();
					$dataFather['genre'] = $father->getMale();
					$father->fill($dataFather);
					$father->save();
				}
				
				$fatherKey = $father->getKey();

				if (array_key_exists('is_representant', $data['father']) && $data['father']['is_representant'] == 1) {
					$representantId = $fatherKey;
				}

			} 


			//if exists mother
			if (array_key_exists('has_mother', $data) && $data['has_mother'] == 1) {
				$dataMother = $data['mother'];
				$dataMother['person_type_id'] = $this->getPersonType();
				$dataMother['identification_type_id'] = $this->getIdentification('cedula');
				$mother = Person::where('num_identification',$dataMother['num_identification'])->first();
				if ($mother) {
					$paUser->mother->update($dataMother);
				} else {
					$mother = new Person();
					$dataMother['genre'] = $mother->getFemale();
					$mother->fill($dataFather);
					$mother->save();
				}

				$motherKey = $mother->getKey();

				if (array_key_exists('is_representant', $data['mother']) && $data['mother']['is_representant'] == 1) {
					$representantId = $motherKey;
				}

			}


			//representant
			if(array_key_exists('representant', $data) && !$representantId) {
				$dataRepresentant = $data['representant'];
				$dataRepresentant['person_type_id'] = $this->getPersonType();
				$dataRepresentant['identification_type_id'] = $this->getIdentification('cedula');
				$representant = Person::where('num_identification',$dataRepresentant['num_identification'])->first();
				if($representant) {
					//update person
					$representant->fill($dataRepresentant)->update();
				} else {
					//create person
					$representant = new Person();
					$representant->fill($data['representant']);
					$representant->save();
				}
				$representantId = $representant->getKey();
			}


			$data['father_id'] = $fatherKey;
			$data['mother_id'] = $motherKey;
			$data['representant_id'] = $representantId;
			$data['person_type_id'] = $this->getPersonType();
			$data['identification_type_id'] = $this->getIdentification('cedula');
			$paUser->person->update($data);
			$paUser->fill($data);
			if($paUser->update()){
				
				$key = $paUser->getKey();
				return $this->find($key);
			}


		} else {
			throw new PatientUserException(['title'=>'Ha ocurrido un error al actualizar los datos del usuario '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
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


	public function getPersonType() {
		return PersonType::select('id')->where('code','persona-natural')->first()->id;
	}


	public function getIdentification($type)
    {
        return  IdentificationType::where('code',$type)->first()->id;
    }



	/**	
		find available parents
	**/
	public function getParents($parentType)
	{
		if ($parentType == 'father' || $parentType == 'mother') {
			$genre = $parentType == 'father' ? 'M' : 'F';
			$personType = $this->getPersonType();
			$parents = Person::whereRaw('id not in ( select person_id from patient_user) and person_type_id = '.$personType)->where('genre',$genre)->get();
			return $parents;
		} else {
			throw new PatientUserException("Ingreso un mal parametro", "500");
			
		}
	}

	/// permite tener un conteo de todas las solicitudes 
	//ingresadas en el día corriente
	public function getTotalUserToday()
	{
		return PatientUser::withoutGlobalScopes()->whereRaw('DATE_FORMAT(created_at,"%Y-%m-%d") = DATE_FORMAT(now(),"%Y-%m-%d")')->count();
	}
}