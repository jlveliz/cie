<?php
namespace Cie\Repository;

use Cie\RepositoryInterface\RequestRepositoryInterface;
use Cie\Exceptions\RequestException;
use Cie\Models\Request;

/**
* 
*/
class RequestRepository implements RequestRepositoryInterface
{
	
	public function paginate()
	{
		return Request::paginate(10);
	}

	
	public function enum($params = null)
	{
		$requests = Request::get();

		if (!$requests) {
			throw new RequestException(['title'=>'No se han encontrado el listado de  solicitudes de fichas de inscripción','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");
		}
		return $requests;
	}



	public function find($field)
	{
		if (is_array($field)) {

			if (array_key_exists('num_identification_representant', $field)) { 
				$request = Request::where('num_identification_representant',$field['num_identification_representant'])->first();	
			} else {
				throw new RequestException(['title'=>'No se puede buscar la solicitud','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");	
			}

		} elseif (is_string($field) || is_int($field)) {
			$request = Request::where('id',$field)->first();
		} else {
			throw new RequestException(['title'=>'Se ha producido un error al buscar la solicitud','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");	
		}

		if (!$request) throw new RequestException(['title'=>'No se puede buscar la solicitud','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");	
		
		return $request;

	}

	//TODO
	public function save($data)
	{
		// $request = new Request();
		// $request->fill($data);
		// if ($request->save()) {
		// 	$key = $request->getKey();
		// 	return  $this->find($key);
		// } else {
		// 	throw new RequestException(['title'=>'Ha ocurrido un error al guardar el '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
		// }		
	}

	public function edit($id,$data)
	{
		// $Request = Request::find($id);
		// if ($Request) {
		// 	$Request->fill($data);
		// 	if($Request->update()){
		// 		$key = $Request->getKey();
		// 		return $this->find($key);
		// 	}
		// } else {
		// 	throw new RequestException(['title'=>'Ha ocurrido un error al actualizar el módulo '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
		// }


	}

	public function remove($id)
	{
		// if ($Request = $this->find($id)) {
		// 	$Request->delete();
		// 	return true;
		// }
		// throw new RequestException(['title'=>'Ha ocurrido un error al eliminar el módulo ','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
	}
}