<?php
namespace Cie\Repository;

use Cie\RepositoryInterface\ParishRepositoryInterface;
use Cie\Exceptions\ParishException;
use Cie\Models\Parish;

/**
* 
*/
class ParishRepository implements ParishRepositoryInterface
{
	private $parentId;
	
	
	public function setParent($parentId)
	{
		$this->parentId = $parentId;
		return $this;
	}


	public function enum($params = null)
	{
		if ($this->parentId) {
			$parishies = Parish::where('city_id',$this->parentId)->get();
		} else {
			$parishies = Parish::all();
		}

		if (!$parishies) {
			throw new ParishException(['title'=>'No se han encontrado el listado de  Parroquias','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");
		}
		return $parishies;
	}



	public function find($field)
	{
		if (is_array($field)) {

			if (array_key_exists('name', $field)) { 
				$parish = Parish::where('name',$field['name'])->first();	
			} else {

				throw new ParishException(['title'=>'No se puede buscar la Parroquia','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");	
			}

		} elseif (is_string($field) || is_int($field)) {
			$parish = Parish::where('id',$field)->first();
		} else {
			throw new ParishException(['title'=>'Se ha producido un error al buscar la Parroquia','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");	
		}

		if (!$parish) throw new ParishException(['title'=>'No se puede buscar la Parroquia','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");	
		
		return $parish;

	}

	//TODO
	public function save($data)
	{
		$parish = new Parish();
		$parish->fill($data);
		if ($parish->save()) {
			$key = $parish->getKey();
			return  $this->find($key);
		} else {
			throw new ParishException(['title'=>'Ha ocurrido un error al guardar la Parroquia '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
		}		
	}

	public function edit($id,$data)
	{
		$parish = Parish::find($id);
		if ($parish) {
			$parish->fill($data);
			if($parish->update()){
				$key = $parish->getKey();
				return $this->find($key);
			}
		} else {
			throw new ParishException(['title'=>'Ha ocurrido un error al actualizar la Parroquia '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
		}


	}

	public function remove($id)
	{
		if ($parish = $this->find($id)) {
			$parish->delete();
			return true;
		}
		throw new ParishException(['title'=>'Ha ocurrido un error al eliminar la Parroquia ','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
	}
}