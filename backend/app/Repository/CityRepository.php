<?php
namespace Cie\Repository;

use Cie\RepositoryInterface\CityRepositoryInterface;
use Cie\Exceptions\CityException;
use Cie\Models\City;

/**
* 
*/
class CityRepository implements CityRepositoryInterface
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
			$cities = City::where('province_id',$this->parentId)->get();
		} else {
			$cities = City::all();
		}

		if (!$cities) {
			throw new CityException(['title'=>'No se han encontrado el listado de  Ciudades','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");
		}
		return $cities;
	}



	public function find($field)
	{
		if (is_array($field)) {

			if (array_key_exists('name', $field)) { 
				$city = City::where('name',$field['name'])->first();	
			} else {

				throw new CityException(['title'=>'No se puede buscar la Ciudad','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");	
			}

		} elseif (is_string($field) || is_int($field)) {
			$city = City::where('id',$field)->first();
		} else {
			throw new CityException(['title'=>'Se ha producido un error al buscar la Ciudad','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");	
		}

		if (!$city) throw new CityException(['title'=>'No se puede buscar la Ciudad','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");	
		
		return $city;

	}

	//TODO
	public function save($data)
	{
		$city = new City();
		$city->fill($data);
		if ($city->save()) {
			$key = $city->getKey();
			return  $this->find($key);
		} else {
			throw new CityException(['title'=>'Ha ocurrido un error al guardar la Ciudad '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
		}		
	}

	public function edit($id,$data)
	{
		$city = City::find($id);
		if ($city) {
			$city->fill($data);
			if($city->update()){
				$key = $city->getKey();
				return $this->find($key);
			}
		} else {
			throw new CityException(['title'=>'Ha ocurrido un error al actualizar la Ciudad '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
		}


	}

	public function remove($id)
	{
		if ($city = $this->find($id)) {
			$city->delete();
			return true;
		}
		throw new CityException(['title'=>'Ha ocurrido un error al eliminar la Ciudad ','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
	}
}