<?php
namespace Cie\Repository;

use Cie\RepositoryInterface\IdentificationTypeRepositoryInterface;
use Cie\Exceptions\IdentificationTypeException;
use Cie\Models\IdentificationType;

/**
* 
*/
class IdentificationTypeRepository implements IdentificationTypeRepositoryInterface
{
	
	public function enum($params = null)
	{
		$identificationTypes = IdentificationType::all();

		if (!$identificationTypes) {
			throw new IdentificationTypeException(['title'=>'No se han encontrado el listado de  tipos de identificaciones','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");
		}
		return $identificationTypes;
	}



	public function find($field)
	{
		if (is_array($field)) {

			if (array_key_exists('name', $field)) { 
				$identificationType = IdentificationType::where('name',$field['name'])->first();
			} elseif(array_key_exists('code', $field)){
				$identificationType = IdentificationType::where('code',$field['code'])->first();
			} else {
				throw new IdentificationTypeException(['title'=>'No se puede buscar el Tipo de identificación','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");	
			}

		} elseif (is_string($field) || is_int($field)) {
			$identificationType = IdentificationType::find($field);
		} else {
			throw new IdentificationTypeException(['title'=>'Se ha producido un error al buscar el Tipo de Identificación','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");	
		}

		if (!$identificationType) throw new IdentificationTypeException(['title'=>'No se puede buscar el Tipo de Identificación','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");	
		
		return $identificationType;

	}

	//TODO
	public function save($data)
	{
		$identificationType = new IdentificationType();
		$identificationType->fill($data);
		if ($identificationType->save()) {
			$key = $identificationType->getKey();
			return  $this->find($key);
		} else {
			throw new IdentificationTypeException(['title'=>'Ha ocurrido un error al guardar el Tipo de Identificación '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
		}		
	}

	public function edit($id,$data)
	{
		$identificationType = $this->find($id);
		if ($identificationType) {
			$identificationType->fill($data);
			if($identificationType->update()){
				$key = $identificationType->getKey();
				return $this->find($key);
			}
		} else {
			throw new IdentificationTypeException(['title'=>'Ha ocurrido un error al actualizar el Tipo de Identificación '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
		}


	}

	public function remove($id)
	{
		if ($identificationType = $this->find($id)) {
			$identificationType->delete();
			return true;
		}
		throw new IdentificationTypeException(['title'=>'Ha ocurrido un error al eliminar el Tipo de Identificación ','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
	}
}