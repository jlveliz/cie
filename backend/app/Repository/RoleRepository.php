<?php
namespace Cie\Repository;

use Cie\RepositoryInterface\RoleRepositoryInterface;
use Cie\Exceptions\RoleException;
use Cie\Models\Role;

/**
* 
*/
class RoleRepository implements RoleRepositoryInterface
{
	
	public function enum($params = null)
	{
		$roles = Role::all();

		if (!$roles) {
			throw new RoleException(['title'=>'No se han encontrado el listado de rols','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");
		}
		return $roles;
	}



	public function find($field)
	{
		if (is_array($field)) {
			if (array_key_exists('name', $field)) { 
				$role = Role::with('permissions')->where('name',$field['name'])->first();	
			} else {

				throw new RoleException(['title'=>'No se puede buscar el rol','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");	
			}

		} elseif (is_string($field) || is_int($field)) {
			$role = Role::with('permissions')->where('id',$field)->first();
		} else {
			throw new RoleException(['title'=>'Se ha producido un error al buscar el rol','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");	
		}

		if (!$role) throw new RoleException(['title'=>'No se puede buscar al rol','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");	
		
		return $role;

	}

	//TODO
	public function save($data)
	{
		$role = new Role();
		$role->fill($data);
		if ($role->save()) {
			$role->permissions()->sync($data['permissions']);
			$key = $role->getKey();
			return  $this->find($key);
		} else {
			throw new RoleException(['title'=>'Ha ocurrido un error al guardar el rol '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
		}		
	}

	public function edit($id,$data)
	{
		$role = $this->find($id);
		if ($role) {
			$role->fill($data);
			if($role->update()){
				$role->permissions()->sync($data['permissions']);
				$key = $role->getKey();
				return $this->find($key);
			}
		} else {
			throw new RoleException(['title'=>'Ha ocurrido un error al actualizar el rol '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
		}


	}

	public function remove($id)
	{
		if ($role = $this->find($id)) {
			$role->delete();
			return true;
		}
		throw new RoleException(['title'=>'Ha ocurrido un error al eliminar el rol ','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
	}
}