<?php
namespace Cie\Repository;

use Cie\RepositoryInterface\PermissionRepositoryInterface;
use Cie\Exceptions\PermissionException;
use Cie\Models\Permission;

/**
* 
*/
class PermissionRepository implements PermissionRepositoryInterface
{
	
	public function enum($params = null)
	{
		$permissions = Permission::all();

		if (!$permissions) {
			throw new PermissionException(['title'=>'No se han encontrado el listado de permisos','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");
		}
		return $permissions;
	}



	public function find($field)
	{
		if (is_array($field)) {
			if (array_key_exists('name', $field)) { 
				$permission = Permission::where('name',$field['name'])->first();	
			} else {

				throw new PermissionException(['title'=>'No se puede buscar el permiso','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");	
			}

		} elseif (is_string($field) || is_int($field)) {
			$permission = Permission::where('id',$field)->first();
		} else {
			throw new PermissionException(['title'=>'Se ha producido un error al buscar el permiso','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");	
		}

		if (!$permission) throw new PermissionException(['title'=>'No se puede buscar al permiso','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");	
		
		return $permission;

	}

	//TODO
	public function save($data)
	{
		$permission = new Permission();
		$permission->fill($data);
		if ($permission->save()) {
			$key = $permission->getKey();
			return  $this->find($key);
		} else {
			throw new PermissionException(['title'=>'Ha ocurrido un error al guardar el permiso '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
		}		
	}

	public function edit($id,$data)
	{
		$permission = Permission::find($id);
		if ($permission) {
			$permission->fill($data);
			if($permission->update()){
				$key = $permission->getKey();
				return $this->find($key);
			}
		} else {
			throw new PermissionException(['title'=>'Ha ocurrido un error al actualizar el permiso '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
		}


	}

	public function remove($id)
	{
		if ($permission = $this->find($id)) {
			$permission->delete();
			return true;
		}
		throw new PermissionException(['title'=>'Ha ocurrido un error al eliminar el permiso ','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
	}
}