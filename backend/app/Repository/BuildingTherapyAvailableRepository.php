<?php
namespace Cie\Repository;

use Cie\RepositoryInterface\BuildingTherapyAvailableRepositoryInterface;
use Cie\Exceptions\BuildingTherapyException;
use Cie\Models\BuildingTherapyAvailable;
use DB;

/**
* 
*/
class BuildingTherapyAvailableRepository implements BuildingTherapyAvailableRepositoryInterface
{
	
	
	public function enum($params = null)
	{
		// $availables = BuildingTherapyAvailable::where('building_therapy_id',$this->parent)->get();

			// dd($params);
		if($params) {
			$buildingId = 'null';
			$year = date('Y');
			$timefrimeId = 'null';
			$therapyId = 'null';
			$keyDay = 'null';
			
			
			if (array_key_exists('building', $params)) {
				$buildingId = $params['building'];
			} 

			if (array_key_exists('year', $params)) {
				$year = $params['year'];
			}

			if (array_key_exists('timefrime', $params)) {
				$timefrimeId = $params['timefrime'];
			}

			if (array_key_exists('therapyId', $params)) {
				$therapyId = $params['therapyId'];
			}

			if (array_key_exists('key_day', $params)) {
				$keyDay = $params['iv_key_day'];
			}

			if (!$buildingId) {
				
				throw new BuildingTherapyException(['title'=>'No se han encontrado el listado de edificios','detail'=>'Por favor seleccione un edificio para realizar la búsqueda','level'=>'error'],"404");
			}


			$availables = DB::select(" call therapyavailable_fn_consultar($buildingId, $year, $timefrimeId , $therapyId, $keyDay);");
			
		}



		if (count($availables) >  0) {
			foreach ($availables as $key => $available) {
				$available->schedule = unserialize($available->schedule);
			}
		}

		return collect($availables);
	}



	public function find($field)
	{
		
		$available = BuildingTherapyAvailable::where('id',$field)->first();
		
		if (!$available) {
			throw new BuildingTherapyException(['title'=>'Se ha producido un error al buscar la disponibilidad','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");	
		}
		
		
		return $available;

	}

	public function save($data)
	{
		$buildingTherapyId = $data['in_building_therapy_id'];
		$year = $data['in_year'];
		$timefrimeId = $data['iv_timeframe_id'];
		$available = $data['iv_avalability'];


		$available = DB::select(" call therapyavailable_pr_ingresar($buildingTherapyId, $year, '$timefrimeId' , $available);");


		if ($available[0]->title != null) {
			throw new BuildingTherapyException(['title'=>$available[0]->title,'detail'=>$available[0]->detail,'level'=>'error'],"500");
		}


		return BuildingTherapyAvailable::where('building_therapy_id',$buildingTherapyId)->where('year',$year)->where('timeframe_id',$timefrimeId)->first();
				
	}

	public function edit($id,$data)
	{
		$available = BuildingTherapyAvailable::find($id);
		if ($available) {
			$available->fill($data);
			if($available->update()){
				$key = $available->getKey();
				return $this->find($key);
			}
		} else {
			throw new BuildingTherapyException(['title'=>'Ha ocurrido un error al actualizar la disponibilidad '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
		}


	}

	public function remove($id)
	{
		if ($available = $this->find($id)) {
			$available->delete();
			return true;
		}
		throw new BuildingTherapyException(['title'=>'Ha ocurrido un error al eliminar la disponibilidad ','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
	}
}