<?php
namespace Cie\Exceptions;

use Cie\Exceptions\AppException;
/**
* 
*/
class PathologyException extends AppException
{
	
	/**
	 * @string default 404
	 */
	protected $status = "404";

	public function __construct(array $params,$status)
	{
		$this->status = $status;
		$message = $this->build($params);
		parent::__construct($message);
	}
}