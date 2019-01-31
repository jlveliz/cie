<?php
namespace Cie\Repository;

use Cie\RepositoryInterface\BuildingRepositoryInterface;
use Cie\Exceptions\BuildingException;
use Cie\Models\Building;

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

				if (array_key_exists('therapies', $data)) {
					$therapiesOnDb = $building->therapies->toArray();
					$therapiesToInsert = [];
					$therapiesToUpdate = [];
					$therapiesToDelete = [];
					foreach ($data['therapies'] as $key => $therapy) {
						//to insert
						if (!array_key_exists('id', $therapy)) {
							$therapiesToInsert[] = $therapy;
						} else {
							
							$keyFounded = array_search($therapy['id'], array_column($therapiesOnDb, 'id'));
							
							if($keyFounded >= 0) {
								$therapiesToUpdate[] = $therapy;
							}
							
						}
					}

					//to delete
					if (count($therapiesOnDb) > 0) {
						
						foreach ($therapiesOnDb as $key => $therapyOnDb) {
							
							$founded = true;
							
							foreach ($data['therapies'] as $key => $trOnRequest) {
								$founded = !array_search($therapyOnDb['id'], $trOnRequest);
							}

							
							if(!$founded) {
								$therapiesToDelete[] = $therapyOnDb;
							}
						}
						
					}

					dd($therapiesToInsert, $therapiesToUpdate, $therapiesToDelete);
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