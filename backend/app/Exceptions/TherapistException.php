<?php
namespace Cie\Exceptions;

/**
* 
*/
class TherapistException extends AppException
{
	
	public function __construct(array $params,$status)
	{
		$this->status = $status;
		$message = $this->build($params);
		parent::__construct($message);
	}
}