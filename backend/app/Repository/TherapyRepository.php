<?php
namespace Cie\Repository;

use Cie\RepositoryInterface\TherapyRepositoryInterface;
use Cie\Exceptions\TherapyException;
use Cie\Models\Therapy;
use Cie\Models\Permission;

/**
* 
*/
class TherapyRepository implements TherapyRepositoryInterface
{
	
	public function enum($params = null)
	{
		$therapies = Therapy::all();

		if (!$therapies) {
			throw new TherapyException(['title'=>'No se han encontrado el listado de terapias','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");
		}
		return $therapies;
	}



	public function find($field)
	{
		if (is_array($field)) {

			if (array_key_exists('name', $field)) { 
				$therapy = Therapy::where('name',$field['name'])->first();	
			} else {

				throw new TherapyException(['title'=>'No se puede buscar la terapia','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");	
			}

		} elseif (is_string($field) || is_int($field)) {
			$therapy = Therapy::where('id',$field)->first();
		} else {
			throw new TherapyException(['title'=>'Se ha producido un error al buscar la terapia','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");	
		}

		if (!$therapy) throw new TherapyException(['title'=>'No se puede buscar la terapia','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");	
		
		return $therapy;

	}

	//TODO
	public function save($data)
	{
		$therapy = new Therapy();
		$therapy->fill($data);
		if ($therapy->save()) {
			$key = $therapy->getKey();
			return  $this->find($key);
		} else {
			throw new TherapyException(['title'=>'Ha ocurrido un error al guardar la terapia '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
		}		
	}

	public function edit($id,$data)
	{
		$therapy = Therapy::find($id);
		if ($therapy) {
			$therapy->fill($data);
			if($therapy->update()){
				$key = $therapy->getKey();
				return $this->find($key);
			}
		} else {
			throw new TherapyException(['title'=>'Ha ocurrido un error al actualizar la terapia  '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
		}


	}

	public function remove($id)
	{
		if ($therapy = $this->find($id)) {
			$therapy->delete();
			return true;
		}
		throw new TherapyException(['title'=>'Ha ocurrido un error al eliminar la terapia ','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
	}


}