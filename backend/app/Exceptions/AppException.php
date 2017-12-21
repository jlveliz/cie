<?php
namespace Cie\Exceptions;

use Exception;


/**
* 
*/
class AppException extends Exception
{
	
	/**
     * @var string
     */
    protected $name;
 
    /**
     * @var string
     */
    protected $status;
 
    /**
     * @var string
     */
    protected $title;
 
    /**
     * @var string
     */
    protected $detail;

     /**
     * @var string
     */
    protected $level;
 
    /**
     * @param @string $message
     * @return voname
     */
    public function __construct($message)
    {
        parent::__construct($message,$this->status);
    }

	/**
	 * Get the status
	 *
	 * @return int
	 */
	public function getStatus()
	{
	    return (int) $this->status;
	}


	/**
	 * 
	 */
	public function toArray()
	{
		return [
			'name'     => $this->name,
        	'status' => $this->status,
        	'title'  => $this->title,
        	'detail' => $this->detail,
        	'level' => $this->level
		];
	}

	
	/**
	 * Build the Exception
	 *
	 * @param array $args
	 * @return string
	 */
	protected function build(array $args)
	{
	    $this->name =  array_key_exists('name', $args) ? $args['name'] :  array_shift($args);
	    $error = config(sprintf('errors.%s', $this->name));
	 	if ($error) {
	    	$this->title  = $this->name;
	    	$this->detail = vsprintf($error['detail'], $args);
	 	} else {
	 		$this->title =   $this->name;
	 		$this->detail = $args['detail'];
	 		$this->level = $args['level'];
	 	}
	 
	    return $this->detail;
	}

}