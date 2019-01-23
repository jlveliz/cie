<?php
namespace Cie\Repository;

use Cie\RepositoryInterface\CarouselRepositoryInterface;
use Cie\Exceptions\CarouselException;
use Cie\Models\Carousel;

/**
* 
*/
class CarouselRepository implements CarouselRepositoryInterface
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
			$carousels = Carousel::where('carousel_id',$this->parentId)->get();
		} else {
			$carousels = Carousel::all();
		}

		if (!$carousels) {
			throw new CarouselException(['title'=>'No se han encontrado el listado de  Ciudades','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");
		}
		return $carousels;
	}



	public function find($field)
	{
		if (is_array($field)) {

			if (array_key_exists('name', $field)) { 
				$carousel = Carousel::where('name',$field['name'])->first();	
			} else {

				throw new CarouselException(['title'=>'No se puede buscar la Ciudad','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");	
			}

		} elseif (is_string($field) || is_int($field)) {
			$carousel = Carousel::where('id',$field)->first();
		} else {
			throw new CarouselException(['title'=>'Se ha producido un error al buscar la Ciudad','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");	
		}

		if (!$carousel) throw new CarouselException(['title'=>'No se puede buscar la Ciudad','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");	
		
		return $carousel;

	}

	//TODO
	public function save($data)
	{
		$carousel = new Carousel();
		$carousel->fill($data);
		if ($carousel->save()) {
			$key = $carousel->getKey();
			return  $this->find($key);
		} else {
			throw new CarouselException(['title'=>'Ha ocurrido un error al guardar la Ciudad '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
		}		
	}

	public function edit($id,$data)
	{
		$carousel = Carousel::find($id);
		if ($carousel) {
			$carousel->fill($data);
			if($carousel->update()){
				$key = $carousel->getKey();
				return $this->find($key);
			}
		} else {
			throw new CarouselException(['title'=>'Ha ocurrido un error al actualizar la Ciudad '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
		}


	}

	public function remove($id)
	{
		if ($carousel = $this->find($id)) {
			$carousel->delete();
			return true;
		}
		throw new CarouselException(['title'=>'Ha ocurrido un error al eliminar la Ciudad ','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
	}
}