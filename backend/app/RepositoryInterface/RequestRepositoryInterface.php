<?php
namespace Cie\RepositoryInterface;

// use Cie\RespositoryInterface\CoreRepositoryInterface;


interface RequestRepositoryInterface extends CoreRepositoryInterface {

    public function paginate();

}