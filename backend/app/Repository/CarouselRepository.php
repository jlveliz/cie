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
	
	public function enum($params = null)
	{
		
		$carousels = Carousel::all();
		

		if (!$carousels) {
			throw new CarouselException(['title'=>'No se han encontrado el listado de Sliders','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");
		}
		return $carousels;
	}



	public function find($field)
	{
		
		$carousel = Carousel::where('id',$field)->first();
		
		if (!$carousel) {
			throw new CarouselException(['title'=>'Se ha producido un error al buscar el Slider','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");			
		}

		if (!$carousel) throw new CarouselException(['title'=>'No se puede buscar el Slider','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");	
		
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
			throw new CarouselException(['title'=>'Ha ocurrido un error al guardar el Slider '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
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
			throw new CarouselException(['title'=>'Ha ocurrido un error al actualizar el Slider '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
		}


	}

	public function remove($id)
	{
		if ($carousel = $this->find($id)) {
			$carousel->delete();
			return true;
		}
		throw new CarouselException(['title'=>'Ha ocurrido un error al eliminar el Slider ','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
	}
}