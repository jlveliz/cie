<?php
namespace Cie\Repository;

use Cie\RepositoryInterface\BuildingRepositoryInterface;
use Cie\Exceptions\BuildingException;
use Cie\Models\Building;
use Cie\Models\BuildingTherapy;
use DB;

/**
* 
*/
class BuildingRepository implements BuildingRepositoryInterface
{
	
	public function enum($params = null)
	{
		$buildings = Building::get();

		if (!$buildings) {
			throw new BuildingException(['title'=>'No se han encontrado el listado de edificios','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");
		}
		return $buildings;
	}



	public function find($field)
	{
		if (is_array($field)) {

			if (array_key_exists('name', $field)) { 
				$building = Building::where('name',$field['name'])->first();	
			} else {

				throw new BuildingException(['title'=>'No se puede buscar el edificio','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");	
			}

		} elseif (is_string($field) || is_int($field)) {
			$building = Building::where('id',$field)->first();
		} else {
			throw new BuildingException(['title'=>'Se ha producido un error al buscar el edificio','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");	
		}

		if (!$building) throw new BuildingException(['title'=>'No se puede buscar al edificio','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");	
		
		return $building;

	}

	public function save($data)
	{
		$building = new Building();
		$building->fill($data);
		if ($building->save()) {
			$key = $building->getKey();

			return  $this->find($key);
		} else {
			throw new BuildingException(['title'=>'Ha ocurrido un error al guardar el edificio '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
		}		
	}

	public function edit($id,$data)
	{
		$building = Building::find($id);
		if ($building) {
			$building->fill($data);
			if($building->update()){

			
				$newTherapies = [];
				foreach ($data['therapies'] as $key => $therapy) {
					unset($therapy['created_at']);
					unset($therapy['updated_at']);
					unset($therapy['$$hashKey']);
					unset($therapy['availables']);
					unset($therapy['$selected']);
					$serialized = $therapy['schedule'];
					$therapy['schedule'] = $serialized;
					$newTherapies[] = $therapy;
				}
				
				$params = (json_encode($newTherapies));
			
				$query = DB::select("call buildingtherapy_pr_mantenimiento('$params')");
				
				if ($query[0]->ov_error != '0') { 
					throw new BuildingTherapyUserException(['title'=>$query[0]->ov_mensaje,'detail'=>$query[0]->ov_mensaje,'level'=>'error'],"500");
				}
	
				$key = $building->getKey();
				return $this->find($key);
			}
		} else {
			throw new BuildingException(['title'=>'Ha ocurrido un error al actualizar el edificio '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
		}


	}

	public function remove($id)
	{
		if ($building = $this->find($id)) {
			$building->delete();
			return true;
		}
		throw new BuildingException(['title'=>'Ha ocurrido un error al eliminar el Edificio ','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
	}
}