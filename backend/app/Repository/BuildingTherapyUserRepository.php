<?php
namespace Cie\Repository;

use Cie\RepositoryInterface\BuildingTherapyUserRepositoryInterface;
use Cie\Exceptions\BuildingTherapyUserException;
use Cie\Models\PatientUser;
use Cie\Models\BuildingTherapyUser;


/**
* 
*/
class BuildingTherapyUserRepository implements BuildingTherapyUserRepositoryInterface
{
	
	public function enum($params = null)
	{


		if ($params) {

			if (array_key_exists('num_identification', $params)) {

				$buildingTherapyUsers = PatientUser::doesntHave('therapies')->where('state_id',4)->where('num_identification',$params['num_identification'])->first();
				

				if(!count($buildingTherapyUsers)) {
					throw new BuildingTherapyUserException(['title'=>'No se han encontrado el listado de usuarios','detail'=>'No se han encontrado usuarios con este criterio de busqueda o ya existe una entrevista médica creada. Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");
				}

				return $buildingTherapyUsers;

			} 

		} else {

			$buildingTherapyUsers = PatientUser::has('therapies')->get();	
		}

		foreach ($buildingTherapyUsers as $key => $buildUser) {
			$buildUser->load('therapies');
		}

		if (!$buildingTherapyUsers) {
			throw new BuildingTherapyUserException(['title'=>'No se han encontrado el listado de  terapias','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");
		}
		return $buildingTherapyUsers;
	}



	public function find($field)
	{
		if (is_array($field)) {

			if (array_key_exists('patient_user_id', $field)) { 
				$buildingTherapyUser = BuildingTherapyUser::where('patient_user_id',$field['patient_user_id'])->first();	
			} else {

				throw new BuildingTherapyUserException(['title'=>'No se puede encontrar el listado','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");	
			}

		} elseif (is_string($field) || is_int($field)) {
			$buildingTherapyUser = BuildingTherapyUser::where('id',$field)->first();
		} else {
			throw new BuildingTherapyUserException(['title'=>'No se puede encontrar la terapía','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");	
		}

		if (!$buildingTherapyUser) throw new BuildingTherapyUserException(['title'=>'No se puede buscar al módulo','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");	
		
		$buildingTherapyUser->load('patient','buildingTherapy');
		
		$buildingTherapyUser->patient->load('person');
		
		return $buildingTherapyUser;

	}

	//TODO
	public function save($data)
	{
		foreach ($data['building_therapies'] as $key => $value) {
			$datSave = [];
			$datSave['patient_user_id'] = $data['patient_user_id'];
			$datSave['year'] = $data['year'];
			$datSave['group_time_id'] = $data['group_time_id'];
			$datSave['timeframe_id'] = $data['timeframe_id'];
			$datSave['building_therapy_id'] = $value;
			$buildingTherapyUser = new BuildingTherapyUser();
			$buildingTherapyUser->fill($datSave);
			if ($buildingTherapyUser->save()) {
				$key = $buildingTherapyUser->getKey();
				// return  $this->find($key);
			} else {
				throw new BuildingTherapyUserException(['title'=>'Ha ocurrido un error al asignar la terapia al usuario '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
			}
		}

		return PatientUser::find($data['patient_user_id']);
	}

	public function edit($id,$data)
	{
		$buildingTherapyUser = BuildingTherapyUser::find($id);
		if ($buildingTherapyUser) {
			$buildingTherapyUser->fill($data);
			if($buildingTherapyUser->update()){
				$key = $buildingTherapyUser->getKey();
				return $this->find($key);
			}
		} else {
			throw new BuildingTherapyUserException(['title'=>'Ha ocurrido un error al asignar las terapias al usuario '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
		}


	}

	public function remove($id)
	{
		if ($buildingTherapyUser = $this->find($id)) {
			$buildingTherapyUser->delete();
			return true;
		}
		throw new BuildingTherapyUserException(['title'=>'Ha ocurrido un error al eliminar la terapia ','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
	}
}