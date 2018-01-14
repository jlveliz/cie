<?php
namespace Cie\Repository;

use Cie\RepositoryInterface\PathologyRepositoryInterface;
use Cie\Exceptions\PathologyException;
use Cie\Models\Pathology;

/**
* 
*/
class PathologyRepository implements PathologyRepositoryInterface
{
	public function enum($params = null)
	{
		
		$pathologies = Pathology::all();
		

		if (!$pathologies) {
			throw new PathologyException(['title'=>'No se han encontrado el listado de  Patologías','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");
		}
		return $pathologies;
	}



	public function find($field)
	{
		if (is_array($field)) {

			if (array_key_exists('name', $field)) { 
				$pathology = Pathology::where('name',$field['name'])->first();	
			} else {

				throw new PathologyException(['title'=>'No se puede buscar la Patología','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");	
			}

		} elseif (is_string($field) || is_int($field)) {
			$pathology = Pathology::where('id',$field)->first();
		} else {
			throw new PathologyException(['title'=>'Se ha producido un error al buscar la Patología','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");	
		}

		if (!$pathology) throw new PathologyException(['title'=>'No se puede buscar la Patología','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");	
		
		return $pathology;

	}

	//TODO
	public function save($data)
	{
		$pathology = new Pathology();
		$pathology->fill($data);
		if ($pathology->save()) {
			$key = $pathology->getKey();
			return  $this->find($key);
		} else {
			throw new PathologyException(['title'=>'Ha ocurrido un error al guardar la Patología '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
		}		
	}

	public function edit($id,$data)
	{
		$pathology = Pathology::find($id);
		if ($pathology) {
			$pathology->fill($data);
			if($pathology->update()){
				$key = $pathology->getKey();
				return $this->find($key);
			}
		} else {
			throw new PathologyException(['title'=>'Ha ocurrido un error al actualizar la Patología '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
		}


	}

	public function remove($id)
	{
		if ($pathology = $this->find($id)) {
			$pathology->delete();
			return true;
		}
		throw new PathologyException(['title'=>'Ha ocurrido un error al eliminar la Patología ','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
	}
}