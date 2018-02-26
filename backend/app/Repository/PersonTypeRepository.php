<?php
namespace Cie\Repository;

use Cie\RepositoryInterface\PersonTypeRepositoryInterface;
use Cie\Exceptions\PersonTypeException;
use Cie\Models\PersonType;

/**
* 
*/
class PersonTypeRepository implements PersonTypeRepositoryInterface
{
	
	public function enum($params = null)
	{
		$personTypes = PersonType::all();

		if (!$personTypes) {
			throw new PersonTypeException(['title'=>'No se han encontrado el listado de  tipos de personas','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");
		}
		return $personTypes;
	}



	public function find($field)
	{
		if (is_array($field)) {

			if (array_key_exists('name', $field)) { 
				$personType = PersonType::where('name',$field['name'])->first();
			} elseif(array_key_exists('code', $field)){
				$personType = PersonType::where('code',$field['code'])->first();
			} else {
				throw new PersonTypeException(['title'=>'No se puede buscar el Tipo de Persona','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");	
			}

		} elseif (is_string($field) || is_int($field)) {
			$personType = PersonType::find($field);
		} else {
			throw new PersonTypeException(['title'=>'Se ha producido un error al buscar el Tipo de Persona','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");	
		}

		if (!$personType) throw new PersonTypeException(['title'=>'No se puede buscar el Tipo de Persona','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");	
		
		return $personType;

	}

	//TODO
	public function save($data)
	{
		$personType = new PersonType();
		$personType->fill($data);
		if ($personType->save()) {
			$key = $personType->getKey();
			return  $this->find($key);
		} else {
			throw new PersonTypeException(['title'=>'Ha ocurrido un error al guardar el Tipo de Persona '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
		}		
	}

	public function edit($id,$data)
	{
		$personType = $this->find($id);
		if ($personType) {
			$personType->fill($data);
			if($personType->update()){
				$key = $personType->getKey();
				return $this->find($key);
			}
		} else {
			throw new PersonTypeException(['title'=>'Ha ocurrido un error al actualizar el Tipo de Persona '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
		}


	}

	public function remove($id)
	{
		if ($personType = $this->find($id)) {
			$personType->delete();
			return true;
		}
		throw new PersonTypeException(['title'=>'Ha ocurrido un error al eliminar el Tipo de Persona ','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
	}
}