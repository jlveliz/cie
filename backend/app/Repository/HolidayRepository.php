<?php
namespace Cie\Repository;

use Cie\RepositoryInterface\HolidayRepositoryInterface;
use Cie\Exceptions\HolidayException;
use Cie\Models\Holiday;

/**
* 
*/
class HolidayRepository implements HolidayRepositoryInterface
{
	
	public function enum($params = null)
	{
		$holidays = Holiday::all();

		if (!$holidays) {
			throw new HolidayException(['title'=>'No se han encontrado el listado de feriados','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");
		}
		return $holidays;
	}



	public function find($field)
	{
		
		$holiday = Holiday::find($field);

		if (!$holiday) {
			throw new HolidayException(['title'=>'Se ha producido un error al buscar el feriado','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");	
		}
		

		if (!$holiday) throw new HolidayException(['title'=>'No se puede buscar el feriado','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");	
		
		return $holiday;

	}

	//TODO
	public function save($data)
	{
		$holiday = new Holiday();
		$holiday->fill($data);
		if ($holiday->save()) {
			$key = $holiday->getKey();
			return  $this->find($key);
		} else {
			throw new HolidayException(['title'=>'Ha ocurrido un error al guardar el feriado '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
		}		
	}

	public function edit($id,$data)
	{
		$holiday = Holiday::find($id);
		if ($holiday) {
			$holiday->fill($data);
			if($holiday->update()){
				$key = $holiday->getKey();
				return $this->find($key);
			}
		} else {
			throw new HolidayException(['title'=>'Ha ocurrido un error al actualizar el feriado  '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
		}


	}

	public function remove($id)
	{
		if ($holiday = $this->find($id)) {
			$holiday->delete();
			return true;
		}
		throw new HolidayException(['title'=>'Ha ocurrido un error al eliminar el feriado ','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
	}


}