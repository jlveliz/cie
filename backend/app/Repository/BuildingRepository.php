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

				// if (array_key_exists('therapies', $data)) {
				// 	$therapiesOnDb = $building->therapies->toArray();
				// 	$therapiesToInsert = [];
				// 	$therapiesToUpdate = [];
				// 	$therapiesToDelete = [];
				// 	foreach ($data['therapies'] as $key => $therapy) {
				// 		//to insert
				// 		if (!array_key_exists('id', $therapy)) {
				// 			$therapiesToInsert[] = $therapy;
				// 		} else {
							
				// 			$keyFounded = array_search($therapy['id'], array_column($therapiesOnDb, 'id'));
							
				// 			if($keyFounded >= 0) {
				// 				$therapiesToUpdate[] = $therapy;
				// 			}
							
				// 		}
				// 	}

				// 	//to delete
				// 	if (count($therapiesOnDb) > 0) {
				// 		foreach ($therapiesOnDb as $key => $therapyOnDb) {
							
				// 			if (count($data['therapies']) > 0) {
				// 				$therapyDelete = [];
				// 				foreach ($data['therapies'] as $key => $theraRequest) {
				// 					if(array_key_exists('id', $theraRequest)) {
				// 						$keyFounded = array_search($therapyOnDb['id'], $theraRequest);
				// 						if(!$keyFounded) {
				// 							$therapyDelete[] = 	$therapyOnDb;									
				// 						}
				// 					}
				// 				}
				// 				$therapiesToDelete = $therapyDelete;
				// 			} else {
				// 				$therapiesToDelete[] = $therapyOnDb;
				// 			}
							

							
							
				// 		}
						
				// 	}

				// 	// dd($therapiesToInsert,$therapiesToUpdate,$therapiesToDelete);
				// 	//to insert
				// 	if (count($therapiesToInsert) > 0) {
				// 		foreach ($therapiesToInsert as $key => $therapy) {
				// 			$therapy['availability'] = $therapy['capacity'];
				// 			$buildTherapy = new BuildingTherapy($therapy);
				// 			$building->therapies()->save($buildTherapy);
				// 		}
				// 	}

				// 	//to update
				// 	if (count($therapiesToUpdate) > 0) {
				// 		foreach ($therapiesToUpdate as $key => $therapy) {
				// 			$building->therapies()->where('id',$therapy['id'])->first()->fill($therapy)->save();
				// 		}
				// 	}

				// 	//to delete
				// 	if (count($therapiesToDelete) > 0) {
				// 		foreach ($therapiesToDelete as $key => $therapy) {
				// 			$building->therapies()->where('id',$therapy['id'])->first()->delete();
				// 		}
				// 	}
				// }
				


				$newTherapies = [];
				foreach ($data['therapies'] as $key => $therapy) {
					unset($therapy['created_at']);
					unset($therapy['updated_at']);
					unset($therapy['$$hashKey']);
					unset($therapy['availables']);
					unset($therapy['$selected']);
					$serialized = serialize($therapy['schedule']);
					$therapy['schedule'] = $serialized;
					$newTherapies[] = $therapy;
				}
				
				$params = (str_replace('\\' , '\\\\',(json_encode($newTherapies))));
				// $params = (str_replace("\\" , '\\\\',(json_encode($newTherapies))));
				// dd($params);

				$query = DB::select("call buildingtherapy_pr_mantenimiento('$params')");

				

				
				dd($query);

				
	
	// 			call new_ciex.buildingtherapy_pr_mantenimiento(
 // '{"0":{"id":"1","therapy_id":"1","build_id":"1","therapist_user_id":"53","key_day":"MONDAY","capacity":"1","availability":"0", "schedule":"a:2:{s:5:\\"start\\";s:5:\\"08:00\\";s:3:\\"end\\";s:5:\\"08:30\\";}"}}' 
 // );
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