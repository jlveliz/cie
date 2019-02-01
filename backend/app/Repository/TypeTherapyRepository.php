<?php
namespace Cie\Repository;

use Cie\RepositoryInterface\TypeTherapyRepositoryInterface;
use Cie\Exceptions\TypeTherapyException;
use Cie\Models\TypeTherapy;


/**
* 
*/
class TypeTherapyRepository implements TypeTherapyRepositoryInterface
{
	
	public function enum($params = null)
	{
		$therapies = TypeTherapy::all();

		if (!$therapies) {
			throw new TypeTherapyException(['title'=>'No se han encontrado el listado de tipos de terapias','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");
		}
		return $therapies;
	}



	public function find($field)
	{
		if (is_array($field)) {

			if (array_key_exists('name', $field)) { 
				$therapy = TypeTherapy::where('name',$field['name'])->first();	
			} else {

				throw new TypeTherapyException(['title'=>'No se puede buscar el tipo de terapia','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");	
			}

		} elseif (is_string($field) || is_int($field)) {
			$therapy = TypeTherapy::where('id',$field)->first();
		} else {
			throw new TypeTherapyException(['title'=>'Se ha producido un error al buscar la tipa de terapia','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");	
		}

		if (!$therapy) throw new TypeTherapyException(['title'=>'No se puede buscar la terapia','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");	
		
		return $therapy;

	}

	//TODO
	public function save($data)
	{
		$therapy = new TypeTherapy();
		$therapy->fill($data);
		if ($therapy->save()) {
			$key = $therapy->getKey();
			return  $this->find($key);
		} else {
			throw new TypeTherapyException(['title'=>'Ha ocurrido un error al guardar la terapia '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
		}		
	}

	public function edit($id,$data)
	{
		$therapy = TypeTherapy::find($id);
		if ($therapy) {
			$therapy->fill($data);
			if($therapy->update()){
				$key = $therapy->getKey();
				return $this->find($key);
			}
		} else {
			throw new TypeTherapyException(['title'=>'Ha ocurrido un error al actualizar la terapia  '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
		}


	}

	public function remove($id)
	{
		if ($therapy = $this->find($id)) {
			$therapy->delete();
			return true;
		}
		throw new TypeTherapyException(['title'=>'Ha ocurrido un error al eliminar la terapia ','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
	}


}