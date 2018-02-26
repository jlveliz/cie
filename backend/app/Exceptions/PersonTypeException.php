<?php
namespace Cie\Exceptions;

/**
* 
*/
class PersonTypeException extends AppException
{
	
	public function __construct(array $params,$status)
	{
		$this->status = $status;
		$message = $this->build($params);
		parent::__construct($message);
	}
}