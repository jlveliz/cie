<?php
namespace Cie\Repository;

use Cie\RepositoryInterface\BuildingTherapyUserRepositoryInterface;
use Cie\Exceptions\BuildingTherapyUserException;
use Cie\Models\PatientUser;
use Cie\Models\BuildingTherapyUser;
use Cie\Models\StatePatientUser;
use DB;


/**
* 
*/
class BuildingTherapyUserRepository implements BuildingTherapyUserRepositoryInterface
{
	
	public function enum($params = null)
	{

		$buildingTherapyUsers = null;
		if ($params) {

			if (array_key_exists('num_identification', $params)) {

				$buildingTherapyUsers = PatientUser::with('therapies')->doesntHave('therapies')->where('num_identification',$params['num_identification'])->where('state_id','=',$this->getStatusValoracionFisica())->first();
				

				if(!count($buildingTherapyUsers)) {
					throw new BuildingTherapyUserException(['title'=>'No se han encontrado el listado de usuarios','detail'=>'No se han encontrado usuarios con este criterio de busqueda o ya existe un horario creado. Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");
				}

				return $buildingTherapyUsers;

			} elseif (array_key_exists('name', $params)) {
				
				$buildingTherapyUsers = PatientUser::with('therapies')->doesntHave('therapies')->where(function($query) use ($params){
						$query->where('person.name','like','%'.$params['name'].'%')->orWhere('person.last_name','like','%'.$params['name'].'%');
					})->where('patient_user.state_id','=',$this->getStatusValoracionFisica())->get();

				if(!count($buildingTherapyUsers)) {
					throw new BuildingTherapyUserException(['title'=>'No se han encontrado el listado de usuarios','detail'=>'No se han encontrado usuarios con este criterio de busqueda o ya existe un horario creado. Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");
				}
			} else {

				throw new BuildingTherapyUserException(['title'=>'Parámetros inválidos','detail'=>'parametros invalidos','level'=>'error'],"500");
			}

		} else {

			$buildingTherapyUsers = PatientUser::with('therapies')->has('therapies')->get();	
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
				$buildingTherapyUser = PatientUser::where('patient_user.id',$field['patient_user_id'])->first();	
			} else {

				throw new BuildingTherapyUserException(['title'=>'No se puede encontrar el listado','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");	
			}

		} elseif (is_string($field) || is_int($field)) {
			$buildingTherapyUser = PatientUser::where('patient_user.id',$field)->first();
		} else {
			throw new BuildingTherapyUserException(['title'=>'No se puede encontrar la terapía','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");	
		}

		if (!$buildingTherapyUser) throw new BuildingTherapyUserException(['title'=>'No se puede buscar al módulo','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");	
		
		$buildingTherapyUser->load('therapies');
		
		$buildingTherapyUser->load('person');
		
		return $buildingTherapyUser;

	}

	//TODO
	public function save($data)
	{
		
		// dd($data);

			// $response = [];
			foreach ($data['building_therapies'] as $key => $value) {
				$datSave = [];
				$pUserId = $data['patient_user_id'];
				$datSave['year'] = $data['year'];
				$groupTime = $data['group_time_id'];
				$datSave['timeframe_id'] = $data['timeframe_id'];
				$datSave['building_therapy_id'] = $value;
				$datebegin = date('d/m/y');
				// dd(array($datSave['patient_user_id'], 2019,"'$groupTime'", "'FIRST'", $datSave['building_therapy_id'], "'25/01/2019'", "'30/04/2019'"));
				$response  = DB::select(
					"call therapyuserassistance_pr_ingresadiasterapia($pUserId,2019,'$groupTime','FIRST',$value,'$datebegin','30/04/2019', true)");
				
					
				if ($response[0]->ov_error != '0') {
					throw new BuildingTherapyUserException(['title'=>$response[0]->ov_mensaje,'detail'=>$response[0]->ov_mensaje,'level'=>'error'],"500");
				} 
			}


			$puser = PatientUser::find($data['patient_user_id']);

			if ($puser) {
				$puser->state_id = $this->getStatus();
				return  $this->find($data['patient_user_id']);
			}

			
	}

	public function edit($id,$data)
	{
		$buildingTherapyUser = PatientUser::find($id);
		if ($buildingTherapyUser) {
			
			$dataFinalSave = [];
		
			foreach ($data['therapies'] as $key => $value) {
				$datSave = [];
				$datSave['patient_user_id'] = $data['patient_user_id'];
				$datSave['year'] = $value['year'];
				$datSave['grouptime_id'] = $value['grouptime_id'];
				$datSave['timeframe_id'] = $value['timeframe_id'];
				$datSave['start_date'] = date('d/m/y');
				$datSave['end_date'] = '30/04/2019';
				$datSave['building_therapy_id'] = $value['building_therapy_id'];
				$datSave['id'] = $value['id'];
				$dataFinalSave[] = $datSave;
			}

			$data = json_encode($dataFinalSave);
			
			$response  = DB::select("call therapyuserassistance_pr_actualizadiasterapia('$data')");
			
			if ($response[0]->ov_error != null) {
				throw new BuildingTherapyUserException(['title'=>$response[0]->ov_mensaje,'detail'=>$response[0]->ov_mensaje,'level'=>'error'],"500");
			}

			return $this->find($id);

			
		} else {
			throw new BuildingTherapyUserException(['title'=>'Ha ocurrido un error al asignar las terapias al usuario '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
		}


	}

	public function remove($id)
	{
		if ($buildingTherapyUser = $this->find($id)) {
			$buildingTherapyUser->therapies()->delete();
			$buildingTherapyUser->state_id = $this->getStatusValoracionFisica();
			$buildingTherapyUser->save();
			return true;
		}
		throw new BuildingTherapyUserException(['title'=>'Ha ocurrido un error al eliminar la terapia ','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
	}


	public function getStatus()
	{
		return  StatePatientUser::select('id')->where('code','inscrito')->first()->id;
	}

	public function getStatusValoracionFisica()
	{
		return  StatePatientUser::select('id')->where('code','valorado_fisicamente')->first()->id;
	}
}