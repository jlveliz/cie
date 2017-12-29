<?php
namespace Cie\Repository;

use Cie\RepositoryInterface\PermissionTypeRepositoryInterface;
use Cie\Exceptions\PermissionTypeException;
use Cie\Models\PermissionType;

/**
* 
*/
class PermissionTypeRepository implements PermissionTypeRepositoryInterface
{
	
	public function enum($params = null)
	{
		$tPermissions = PermissionType::all();

		if (!$tPermissions) {
			throw new PermissionTypeException(['title'=>'No se han encontrado el listado de tipos de permisos','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");
		}
		return $tPermissions;
	}



	public function find($field)
	{
		if (is_array($field)) {
			if (array_key_exists('name', $field)) { 
				$tPermission = PermissionType::where('name',$field['name'])->first();	
			} else {

				throw new PermissionTypeException(['title'=>'No se puede buscar el tipo de permiso','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");	
			}

		} elseif (is_string($field) || is_int($field)) {
			$tPermission = PermissionType::where('id',$field)->first();
		} else {
			throw new PermissionTypeException(['title'=>'Se ha producido un error al buscar el tipo permiso','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");	
		}

		if (!$tPermission) throw new PermissionTypeException(['title'=>'No se puede buscar al tipo permiso','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");	
		
		return $tPermission;

	}

	//TODO
	public function save($data)
	{
		$tPermission = new PermissionType();
		$tPermission->fill($data);
		if ($tPermission->save()) {
			$key = $tPermission->getKey();
			return  $this->find($key);
		} else {
			throw new PermissionTypeException(['title'=>'Ha ocurrido un error al guardar el tipo de permiso '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
		}		
	}

	public function edit($id,$data)
	{
		$tPermission = PermissionType::find($id);
		if ($tPermission) {
			$tPermission->fill($data);
			if($tPermission->update()){
				$key = $tPermission->getKey();
				return $this->find($key);
			}
		} else {
			throw new PermissionTypeException(['title'=>'Ha ocurrido un error al actualizar el tipo de permiso '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
		}


	}

	public function remove($id)
	{
		if ($tPermission = $this->find($id)) {
			$tPermission->delete();
			return true;
		}
		throw new PermissionTypeException(['title'=>'Ha ocurrido un error al eliminar el tipo de permiso ','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
	}
}