<?php
namespace Cie\Repository;

use Cie\RepositoryInterface\BuildingTherapyRepositoryInterface;
use Cie\Exceptions\BuildingTherapyException;
use Cie\Models\BuildingTherapy;

/**
* 
*/
class BuildingTherapyRepository implements BuildingTherapyRepositoryInterface
{
	
	protected $parent;

	public function setParent($parent)
	{
		$this->parent = $parent;
		return $this;
	}


	public function enum($params = null)
	{
		$BuildingTherapys = BuildingTherapy::where('build_id',$this->parent)->get();

		if (!$BuildingTherapys) {
			throw new BuildingTherapyException(['title'=>'No se han encontrado el listado de edificios','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");
		}
		return $BuildingTherapys;
	}



	public function find($field)
	{
		if (is_array($field)) {

			if (array_key_exists('name', $field)) { 
				$BuildingTherapy = BuildingTherapy::where('name',$field['name'])->first();	
			} else {

				throw new BuildingTherapyException(['title'=>'No se puede buscar el edificio','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");	
			}

		} elseif (is_string($field) || is_int($field)) {
			$BuildingTherapy = BuildingTherapy::where('id',$field)->first();
		} else {
			throw new BuildingTherapyException(['title'=>'Se ha producido un error al buscar el edificio','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");	
		}

		if (!$BuildingTherapy) throw new BuildingTherapyException(['title'=>'No se puede buscar al edificio','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");	
		
		return $BuildingTherapy;

	}

	public function save($data)
	{
		$BuildingTherapy = new BuildingTherapy();
		$BuildingTherapy->fill($data);
		if ($BuildingTherapy->save()) {
			$key = $BuildingTherapy->getKey();
			return  $this->find($key);
		} else {
			throw new BuildingTherapyException(['title'=>'Ha ocurrido un error al guardar el edificio '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
		}		
	}

	public function edit($id,$data)
	{
		$BuildingTherapy = BuildingTherapy::find($id);
		if ($BuildingTherapy) {
			$BuildingTherapy->fill($data);
			if($BuildingTherapy->update()){
				$key = $BuildingTherapy->getKey();
				return $this->find($key);
			}
		} else {
			throw new BuildingTherapyException(['title'=>'Ha ocurrido un error al actualizar el edificio '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
		}


	}

	public function remove($id)
	{
		if ($BuildingTherapy = $this->find($id)) {
			$BuildingTherapy->delete();
			return true;
		}
		throw new BuildingTherapyException(['title'=>'Ha ocurrido un error al eliminar el Edificio ','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
	}
}