<?php
namespace Cie\Repository;

use Cie\RepositoryInterface\ProvinceRepositoryInterface;
use Cie\Exceptions\ProvinceException;
use Cie\Models\Province;

/**
* 
*/
class ProvinceRepository implements ProvinceRepositoryInterface
{
	
	public function enum($params = null)
	{
		$rovincies = Province::all();

		if (!$rovincies) {
			throw new ProvinceException(['title'=>'No se han encontrado el listado de  Provincias','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");
		}
		return $rovincies;
	}



	public function find($field)
	{
		if (is_array($field)) {

			if (array_key_exists('name', $field)) { 
				$province = Province::where('name',$field['name'])->first();	
			} else {

				throw new ProvinceException(['title'=>'No se puede buscar la Provincia','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");	
			}

		} elseif (is_string($field) || is_int($field)) {
			$province = Province::where('id',$field)->first();
		} else {
			throw new ProvinceException(['title'=>'Se ha producido un error al buscar la Provincia','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");	
		}

		if (!$province) throw new ProvinceException(['title'=>'No se puede buscar la Provincia','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");	
		
		return $province;

	}

	//TODO
	public function save($data)
	{
		$province = new Province();
		$province->fill($data);
		if ($province->save()) {
			$key = $province->getKey();
			return  $this->find($key);
		} else {
			throw new ProvinceException(['title'=>'Ha ocurrido un error al guardar la Provincia '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
		}		
	}

	public function edit($id,$data)
	{
		$province = Province::find($id);
		if ($province) {
			$province->fill($data);
			if($province->update()){
				$key = $province->getKey();
				return $this->find($key);
			}
		} else {
			throw new ProvinceException(['title'=>'Ha ocurrido un error al actualizar la Provincia '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
		}


	}

	public function remove($id)
	{
		if ($province = $this->find($id)) {
			$province->delete();
			return true;
		}
		throw new ProvinceException(['title'=>'Ha ocurrido un error al eliminar la Provincia ','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
	}
}