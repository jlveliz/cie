<?php
namespace Cie\Exceptions;

/**
* 
*/
class PhysicalAssessmentException extends AppException
{
	
	public function __construct(array $params,$status)
	{
		$this->status = $status;
		$message = $this->build($params);
		parent::__construct($message);
	}
}