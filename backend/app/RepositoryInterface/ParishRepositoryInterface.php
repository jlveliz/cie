<?php
namespace Cie\RepositoryInterface;

// use Cie\RespositoryInterface\CoreRepositoryInterface;


interface ParishRepositoryInterface extends CoreRepositoryInterface {
	public function setParent($parentId);
}