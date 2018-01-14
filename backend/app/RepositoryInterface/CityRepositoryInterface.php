<?php
namespace Cie\RepositoryInterface;

// use Cie\RespositoryInterface\CoreRepositoryInterface;


interface CityRepositoryInterface extends CoreRepositoryInterface {

	public function setParent($parentId);
}