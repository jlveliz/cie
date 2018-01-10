<?php
namespace Cie\RepositoryInterface;

// use Cie\RespositoryInterface\CoreRepositoryInterface;


interface ModuleRepositoryInterface extends CoreRepositoryInterface {
	
	public function loadMenu($userId);
}