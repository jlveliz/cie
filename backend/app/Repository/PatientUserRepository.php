<?php
namespace Cie\Repository;

use Cie\RepositoryInterface\PatientUserRepositoryInterface;
use Cie\Exceptions\PatientUserException;
use Cie\Models\PatientUser;
use Cie\Models\Person;
use Cie\Models\PersonType;
use Cie\Models\IdentificationType;
use Cie\Models\Province;
use Cie\Models\StatePatientUser;
use Cie\Models\City;
use Cie\Models\Parish;
use Cie\Models\Historical\HistoricalPatientUser;
use Image;
use Excel;
use DB;

/**
* 
*/
class PatientUserRepository implements PatientUserRepositoryInterface
{
	
	
	public function paginate()
	{
		return PatientUser::paginate(10);
	}

	public function enum($params = null)
	{
		$paUsers = null;
		if ($params) {
			if (is_array($params)) {
				if (array_key_exists('num_identification', $params) && isset($params['num_identification'])) {
					$paUsers = $this->find($params);
					//USADO PARA LA BUSQUEDA DE USUARIOS EN EVALUACIONES PSICOLOGICA Y MÉDICA
				} elseif (array_key_exists('name', $params) && isset($params['name'])) {
					$paUsers = PatientUser::where('person.name','like','%'.$params['name'].'%')->orWhere('person.last_name','like','%'.$params['name'].'%'); // refactor
					$counter = $paUsers->count();
					$paUsers = $paUsers->paginate($counter);
					if (!count($paUsers)) throw new PatientUserException(['title'=>'No se han encontrado el listado de usuarios','detail'=>'No se han encontrado usuarios con este criterio de busqueda, Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");
				}
			}
		} elseif (Auth::user()->hasAnyRole(['admin','dirTerapia','recepcion'])) {

			$paUsers = PatientUser::get();
			
		}
		
		if (!$paUsers) {
			throw new PatientUserException(['title'=>'No se han encontrado el listado de usuarios','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");
		}
		return $paUsers;
	}



	public function find($field)
	{
		if (is_array($field)) {
			if (array_key_exists('num_identification', $field)) { 
				$paUser = PatientUser::where('person.num_identification',$field['num_identification'])->first();
			} elseif (array_key_exists('conadis_id', $field)) {
				$paUser = PatientUser::where('patient_user.conadis_id',$field['conadis_id'])->first();	
			} elseif (array_key_exists('person_id', $field)) {
				$paUser = PatientUser::where('patient_user.person_id',$field['person_id'])->first();	
			} else {
				throw new PatientUserException(['title'=>'No se puede buscar el Usuario','detail'=>'No se puede buscar el Usuario, Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");	
			}

		} elseif (is_string($field) || is_int($field)) {
			$paUser = PatientUser::where('patient_user.id',$field)->first();
		} else {
			throw new PatientUserException(['title'=>'Se ha producido un error al buscar el Usuario','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");	
		}

		if (!$paUser) throw new PatientUserException(['title'=>'No se puede buscar el Usuario','detail'=>'No se ha encontrado el usuario, Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");	
		
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
		if ( (array_key_exists('representant', $data) && $data['representant']) && (!isset($data['mother']['is_representant'])  && !isset($data['father']['is_representant'])) )  {
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
			$data['state_id'] = $this->getStateInitial();
			$data['person_id'] = $personKey;
			$data['father_id'] = $fatherKey;
			$data['mother_id'] = $motherKey;
			$data['representant_id'] = $representantId;
			$pUPatient->fill($data);
			if($pUPatient->save()){
				$key = $pUPatient->getKey();

				//attachment 
				$repreIdenficationCard = isset($data['representant_identification_card']) ? $data['representant_identification_card'] : null;
				
				$userIdenficationCard = isset($data['user_identification_card']) ? $data['user_identification_card'] : null;
				
				$conadisIdenficationCard = isset($data['conadis_identification_card']) ? $data['conadis_identification_card'] : null;

				$specialistCertificate = isset($data['specialist_certificate']) ? $data['specialist_certificate'] : null;

				//attached
				$pUPatient->attached()->create([
					'representant_identification_card' => $repreIdenficationCard ? $this->uploadAttachment($key,$repreIdenficationCard) : '',
					'user_identification_card' => $userIdenficationCard ? $this->uploadAttachment($key,$userIdenficationCard) : '',
					'conadis_identification_card' => $conadisIdenficationCard ? $this->uploadAttachment($key,$conadisIdenficationCard) : '',
					'specialist_certificate' => $specialistCertificate ? $this->uploadAttachment($key,$specialistCertificate) : '',
				]);
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
			$paUserReplicate = $paUser->replicate();

			//if exists father
			if (array_key_exists('has_father', $data) && $data['has_father'] == 1) {
				$dataFather = $data['father'];
				$dataFather['person_type_id'] = $this->getPersonType();
				$dataFather['identification_type_id'] = $this->getIdentification('cedula');
				$father = Person::where('num_identification',$dataFather['num_identification'])->first();
				if($father) {
					$father->fill($dataFather);
					$father->update();
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
					$mother->fill($dataMother);
					$mother->update();
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
			if(array_key_exists('representant', $data) && !$representantId && count($data['representant'])) {
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
				//save de last data on the historical
				$historical = new HistoricalPatientUser($paUserReplicate->toArray());
				$paUser->historical()->save($historical);
				
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

    public function getStateInitial()
    {
    	return  StatePatientUser::select('id')->where('code','inscrito')->first()->id;
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


	public function uploadAttachment($puserId,$photo)
	{
		if ($photo->isValid()) {
			
			$realPath = $photo->getRealPath();
			$image = Image::make($realPath);
			$isLandScape = true;

			if ($image->width() >= $image->height()) {
				$isLandScape = false;
			}
			//is landscape
			if ($isLandScape) {
				$image->resize(309,482,function($constraint){
					$constraint->aspectRatio();
				});
			} else {
				//is portrait
				$image->resize(722,482,function($constraint){
					$constraint->aspectRatio();
				});				
			}


			$imageName = '_'.str_random().'_'.$puserId.'.'. $photo->getClientOriginalExtension();
			if($image->save(public_path().'/uploads/user_doc/'.$imageName)){
				return 'public/uploads/user_doc/'.$imageName;
			}
		}
	}


	/**
	 * IMPORT DATA
	 */

	public function importData()
	{
		
		function extractLastName($string) {
			$lastName =  explode(" ", $string);
			return $lastName[1] .' '. array_key_exists(2, $lastName) ? $lastName[2] : '';
		}


		function getSchooling($value)
		{
			switch ($value) {
				case 'Regular':
					$value = 1;
					break;
				case 'Especial':
					$value = 2;
					break;
				default:
					$value = 3;
					break;
			}

			return $value;
		}

		function getSchoolingType($value)
		{
			$valInt;

			switch ($value) {
				case 'Fiscal':
					$valInt = 1;
					break;
				case 'Particular':
					$valInt = 2;
					break;
				case 'Fiscomisional':
					$valInt = 3;
					break;
				default:
					$valInt = 4;
					break;
			}

			return $valInt;
		}

		function getDisabilityGrade($value)
		{
			switch ($value) {
				case 'Leve':
					$value = 'l';
					break;
				case 'Moderado':
					$value = 'm';
					break;
				case 'Severo':
					$value = 's';
					break;
				default:
					$value = 'g';
					break;
			}

			return $value;
		}

		function getInsurance($value) {

			switch ($value) {
				case 'IESS':
					$value = 1;
					break;
				case 'SI':
					$value = 2;
					break;
				default:
					$value = 4;
					break;
			}

			return $value;
		}

		function getMedicalAttention($value) {
			switch ($value) {
				case 'IESS':
					$value = 2;
					break;
				case 'ISFA':
					$value = 3;
					break;
				case 'MSP':
					$value = 4;
					break;
				default:
					$value = 1;
					break;
			}

			return $value;
		}

		Excel::load(public_path()."/tester.xlsx",function($payload){
			$results = $payload->get();
            foreach ($results as $person) {
            	$dataToSave = [
            		'last_name' => $person->apellidos,
            		'name' => $person->nombres,
            		'date_birth' => $person->fecha_nacimiento,
        			'age' => $person->edad,
                    'genre' => $person->sexo,
            		'num_identification'=> $person->cedula,
            		'schooling'=> getSchooling($person->tiene_escolarizacion),
            		'schooling_type' => getSchoolingType($person->tipo_escolarizacion),
            		'schooling_name' => $person->institucion_escolarizacion,
        			'province_id' => Province::select('id')->where('name',$person->provincia)->first() ? Province::select('id')->where('name',$person->provincia)->first()->id : null,
        			'city_id'=> City::select('id')->where('name',$person->canton)->first() ? City::select('id')->where('name',$person->canton)->first()->id : null, 
        			'parish_id'=> Parish::select('id')->where('name',$person->parroquia)->first()? Parish::select('id')->where('name',$person->parroquia)->first()->id : null,
        			'address' => $person->direccion,
        			'date_admission' => $person->fecha_ingreso,
        			// 'state' => $person->estado == 'Activo' ? 1 : 0,
        			'state_id' => 4,
        			'physical_disability' => $person->tipo_discapacidad == 'Física' ? ltrim($person->porcentaje,"0.") : 0,
        			'intellectual_disability' => $person->tipo_discapacidad == 'Intelectual' ? ltrim($person->porcentaje ,"0."): 0,
        			'hearing_disability' => $person->tipo_discapacidad == 'Auditiva' ? ltrim($person->porcentaje ,"0.") : 0,
        			'visual_disability' => $person->tipo_discapacidad == 'Visual' ? ltrim($person->porcentaje ,"0.") : 0,
        			'psychosocial_disability' => $person->tipo_discapacidad == 'Psicosocial' ? ltrim($person->porcentaje ,"0.") : 0,
        			'language_disability' => $person->tipo_discapacidad == 'Lenguaje' ? ltrim($person->porcentaje ,"0.") : 0,
        			'grade_of_disability_id' => getDisabilityGrade($person->grado),
        			'conadis_id' => $person->conadis_carnet,
        			'other_diagnostic' => $person->diagnostico_secundario .' '. $person->otro_diagnostico,
        			'entity_send_diagnostic' => $person->entidad_emitio_diagnostico,
        			'assist_other_therapeutic_center' => $person->asiste_otro_centro_terapeutico == 'SI' ? 1 : 0,
        			'has_insurance' => getInsurance($person->posee_seguro),
        			'receives_medical_attention' => getMedicalAttention($person->tiene_atencion_medica)
            		// 'representant' => [
            		// 	'name' => explode(" ", $person->representant_name)[0],
            		// 	'last_name'=>extractLastName($person->representant_name),
            		// ]
            	];
            	// dd($dataToSave);
            	if ($pUser = PatientUser::where('person.num_identification',$dataToSave['num_identification'])->first()) {
            		$this->edit($pUser->id,$dataToSave);
            	} else {
            		$this->save($dataToSave);
            	}
            }
            return "Terminado";
        });

	}
}