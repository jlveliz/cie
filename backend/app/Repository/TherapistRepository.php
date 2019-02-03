<?php
namespace Cie\Repository;

use Cie\RepositoryInterface\TherapistRepositoryInterface;
use Cie\Exceptions\TherapistException;
use Cie\Models\User;
use Cie\Models\Role;

/**
* 
*/
class TherapistRepository implements TherapistRepositoryInterface
{
	
	public function enum($params = null)
	{
		$therapists = User::whereHas('roles',function($query) {
			$query->where('role_id',$this->getRoleTherapist());
		})->get();
		
		if (!$therapists) {
			throw new TherapistException(['title'=>'No se han encontrado el listado de terapeutas','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");
		}
		return $therapists;
	}



	public function find($field)
	{
		// if (is_array($field)) {

		// 	if (array_key_exists('name', $field)) { 
		// 		$Therapist = Therapist::where('name',$field['name'])->first();	
		// 	} else {

		// 		throw new TherapistException(['title'=>'No se puede buscar la terapia','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");	
		// 	}

		// } elseif (is_string($field) || is_int($field)) {
		// 	$Therapist = Therapist::where('id',$field)->first();
		// } else {
		// 	throw new TherapistException(['title'=>'Se ha producido un error al buscar la terapia','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");	
		// }

		// if (!$Therapist) throw new TherapistException(['title'=>'No se puede buscar la terapia','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");	
		
		// return $Therapist;

	}

	//TODO
	public function save($data)
	{
		// $Therapist = new Therapist();
		// $Therapist->fill($data);
		// if ($Therapist->save()) {
		// 	$key = $Therapist->getKey();
		// 	return  $this->find($key);
		// } else {
		// 	throw new TherapistException(['title'=>'Ha ocurrido un error al guardar la terapia '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
		// }		
	}

	public function edit($id,$data)
	{
		// $Therapist = Therapist::find($id);
		// if ($Therapist) {
		// 	$Therapist->fill($data);
		// 	if($Therapist->update()){
		// 		$key = $Therapist->getKey();
		// 		return $this->find($key);
		// 	}
		// } else {
		// 	throw new TherapistException(['title'=>'Ha ocurrido un error al actualizar la terapia  '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
		// }


	}

	public function remove($id)
	{
		// if ($Therapist = $this->find($id)) {
		// 	$Therapist->delete();
		// 	return true;
		// }
		// throw new TherapistException(['title'=>'Ha ocurrido un error al eliminar la terapia ','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
	}


	public function getRoleTherapist()
	{
		$idRole = Role::select('id')->where('code','terapeuta')->first();
		
		if ($idRole) {
			return $idRole->id;
		}
	}


}