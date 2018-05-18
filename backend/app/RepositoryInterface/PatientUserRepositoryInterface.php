<?php
namespace Cie\RepositoryInterface;


interface PatientUserRepositoryInterface extends CoreRepositoryInterface {
	
	
	public function paginate();

	public function getPersonType();

	public function getParents($parentType);


	/// permite tener un conteo de todas las solicitudes 
	//ingresadas en el día corriente
	public function getTotalUserToday();

	public function importData();

	public function uploadAttachment($photo);

}