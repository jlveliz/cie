<?php
namespace Cie\RepositoryInterface;

// use Cie\RespositoryInterface\CoreRepositoryInterface;


interface CarouselRepositoryInterface extends CoreRepositoryInterface {
	
	public function setParent($parentId);
}