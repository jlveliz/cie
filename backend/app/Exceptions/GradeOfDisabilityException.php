<?php
namespace Cie\Exceptions;

/**
* 
*/
class GradeOfDisabilityException extends AppException
{
	
	public function __construct(array $params,$status)
	{
		$this->status = $status;
		$message = $this->build($params);
		parent::__construct($message);
	}
}