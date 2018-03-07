<?php
namespace Cie\RepositoryInterface;


interface PatientUserRepositoryInterface extends CoreRepositoryInterface {
	
	public function getPersonType();

	public function getParents($parentType);

}