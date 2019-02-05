<?php
namespace Cie\Repository;

use Cie\RepositoryInterface\BuildingTherapyAvailableRepositoryInterface;
use Cie\Exceptions\BuildingTherapyException;
use Cie\Models\BuildingTherapyAvailable;

/**
* 
*/
class BuildingTherapyAvailableRepository implements BuildingTherapyAvailableRepositoryInterface
{
	
	protected $parent;

	public function setParent($parent)
	{
		$this->parent = $parent;
		return $this;
	}


	public function enum($params = null)
	{
		$availables = BuildingTherapyAvailable::where('buildin_therapy_id',$this->parent)->get();

		if (!$availables) {
			throw new BuildingTherapyException(['title'=>'No se han encontrado el listado de edificios','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");
		}
		return $availables;
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
		$available = new BuildingTherapyAvailable();
		$available->fill($data);
		if ($available->save()) {
			$key = $available->getKey();
			return  $this->find($key);
		} else {
			throw new BuildingTherapyException(['title'=>'Ha ocurrido un error al guardar la disponibilidad '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
		}		
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