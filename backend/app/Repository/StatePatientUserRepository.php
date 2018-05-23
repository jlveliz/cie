<?php
namespace Cie\Repository;

use Cie\RepositoryInterface\StatePatientUserRepositoryInterface;
use Cie\Exceptions\StatePatientUserException;
use Cie\Models\StatePatientUser;

/**
* 
*/
class StatePatientUserRepository implements StatePatientUserRepositoryInterface
{
	public function enum($params = null)
	{
		
		$states = StatePatientUser::all();
		if (!$states) {
			throw new StatePatientUserException(['title'=>'No se han encontrado el listado de  estados de pacientes','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");
		}
		return $states;
	}



	public function find($field)
	{
		if (is_array($field)) {

			if (array_key_exists('name', $field)) { 
				$state = StatePatientUser::where('name',$field['name'])->first();	
			} elseif(array_key_exists('code', $field)) {
				$state = StatePatientUser::where('code',$field['code'])->first();
			}else {

				throw new StatePatientUserException(['title'=>'No se puede buscar el estado de paciente','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");	
			}

		} elseif (is_string($field) || is_int($field)) {
			$state = StatePatientUser::where('id',$field)->first();
		} else {
			throw new StatePatientUserException(['title'=>'Se ha producido un error el estado de paciente','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");	
		}

		if (!$state) throw new StatePatientUserException(['title'=>'No se puede buscar el estado de paciente','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");	
		
		return $state;

	}

	//TODO
	public function save($data)
	{
		$state = new StatePatientUser();
		$state->fill($data);
		if ($state->save()) {
			$key = $state->getKey();
			return  $this->find($key);
		} else {
			throw new StatePatientUserException(['title'=>'Ha ocurrido un error al guardar el estado del paciente '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
		}		
	}

	public function edit($id,$data)
	{
		$state = StatePatientUser::find($id);
		if ($state) {
			$state->fill($data);
			if($state->update()){
				$key = $state->getKey();
				return $this->find($key);
			}
		} else {
			throw new StatePatientUserException(['title'=>'Ha ocurrido un error al actualizar el estado del paciente '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
		}


	}

	public function remove($id)
	{
		if ($state = $this->find($id)) {
			$state->delete();
			return true;
		}
		throw new StatePatientUserException(['title'=>'Ha ocurrido un error al eliminar el estado del paciente ','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
	}
}