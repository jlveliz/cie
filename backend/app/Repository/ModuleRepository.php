<?php
namespace Cie\Repository;

use Cie\RepositoryInterface\ModuleRepositoryInterface;
use Cie\Exceptions\ModuleException;
use Cie\Models\Module;

/**
* 
*/
class ModuleRepository implements ModuleRepositoryInterface
{
	
	public function enum($params = null)
	{
		$modules = Module::with('permissions')->get();

		if (!$modules) {
			throw new ModuleException(['title'=>'No se han encontrado el listado de  módulos','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");
		}
		return $modules;
	}



	public function find($field)
	{
		if (is_array($field)) {

			if (array_key_exists('name', $field)) { 
				$Module = Module::where('name',$field['name'])->first();	
			} else {

				throw new ModuleException(['title'=>'No se puede buscar el módulo','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");	
			}

		} elseif (is_string($field) || is_int($field)) {
			$Module = Module::where('id',$field)->first();
		} else {
			throw new ModuleException(['title'=>'Se ha producido un error al buscar el módulo','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");	
		}

		if (!$Module) throw new ModuleException(['title'=>'No se puede buscar al módulo','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");	
		
		return $Module;

	}

	//TODO
	public function save($data)
	{
		$module = new Module();
		$module->fill($data);
		if ($module->save()) {
			$key = $module->getKey();
			return  $this->find($key);
		} else {
			throw new ModuleException(['title'=>'Ha ocurrido un error al guardar el módulo '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
		}		
	}

	public function edit($id,$data)
	{
		$module = Module::find($id);
		if ($module) {
			$module->fill($data);
			if($module->update()){
				$key = $module->getKey();
				return $this->find($key);
			}
		} else {
			throw new ModuleException(['title'=>'Ha ocurrido un error al actualizar el módulo '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
		}


	}

	public function remove($id)
	{
		if ($module = $this->find($id)) {
			$module->delete();
			return true;
		}
		throw new ModuleException(['title'=>'Ha ocurrido un error al eliminar el módulo ','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
	}


	public function loadMenu($userId)
	{
		$query = Module::select('module.*')->with(['permissions'=>function($query){
			$query->where('permission.type_id = (select id from permission_type where code = "menu")');
		}])->leftJoin('permission','permission.module_id','=','module.id')->whereRaw("module.id in (SELECT
			per.module_id
		FROM
			permission per
		left JOIN role_permission rPer ON rPer.permission_id = per.id
		left join user_role rolU on rolU.role_id = rPer.role_id
		left join user on `user`.id = rolU.user_id
		where user.id = ".$userId.") and permission.type_id = (select id from permission_type where code = 'menu')")
		->groupBy('module.name')->get();
// dd($query);
		return $query;
	}
}