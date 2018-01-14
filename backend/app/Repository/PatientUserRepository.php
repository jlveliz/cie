<?php
namespace Cie\Repository;

use Cie\RepositoryInterface\PatientUserRepositoryInterface;
use Cie\Exceptions\PatientUserException;
use Cie\Models\PatientUser;
use Cie\Models\Person;

/**
* 
*/
class PatientUserRepository implements PatientUserRepositoryInterface
{
	
	public function enum($params = null)
	{
		$paUsers = PatientUser::all();

		if (!$paUsers) {
			throw new RoleException(['title'=>'No se han encontrado el listado de rols','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");
		}
		return $paUsers;
	}



	public function find($field)
	{
		if (is_array($field)) {
			if (array_key_exists('num_identification', $field)) { 
				$paUser = PatientUser::where('num_identification',$field['num_identification'])->first();	
			} elseif (array_key_exists('conadis_id', $field)) {
				$paUser = PatientUser::where('conadis_id',$field['conadis_id'])->first();	
			} elseif (array_key_exists('person_id', $field)) {
				$paUser = PatientUser::where('person_id',$field['person_id'])->first();	
			} else {
				throw new RoleException(['title'=>'No se puede buscar el Usuario','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");	
			}

		} elseif (is_string($field) || is_int($field)) {
			$paUser = PatientUser::find($field);
		} else {
			throw new PatientUserException(['title'=>'Se ha producido un error al buscar el Usuario','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");	
		}

		if (!$paUser) throw new PatientUserException(['title'=>'No se puede buscar el Usuario','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");	
		
		return $paUser;

	}

	//TODO
	public function save($data)
	{
		

		// $paUser = new Person();
		// $paUser->fill($data);
		// if ($paUser->save()) {
		// 	$personId = $paUser->getKey();
		// }	

		// $paUser = new PatientUser();
		// $paUser->fill($data);
		// if ($paUser->save()) {
		// 	$paUser->permissions()->sync($data['permissions']);
		// 	$key = $paUser->getKey();
		// 	return  $this->find($key);
		// } else {
		// 	throw new RoleException(['title'=>'Ha ocurrido un error al guardar el rol '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
		// }		
	}

	public function edit($id,$data)
	{
		// $paUser = $this->find($id);
		// if ($paUser) {
		// 	$paUser->fill($data);
		// 	if($paUser->update()){
		// 		$paUser->permissions()->sync($data['permissions']);
		// 		$key = $paUser->getKey();
		// 		return $this->find($key);
		// 	}
		// } else {
		// 	throw new RoleException(['title'=>'Ha ocurrido un error al actualizar el rol '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
		// }


	}

	public function remove($id)
	{
		// if ($paUser = $this->find($id)) {
		// 	$paUser->delete();
		// 	return true;
		// }
		// throw new RoleException(['title'=>'Ha ocurrido un error al eliminar el rol ','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
	}
}