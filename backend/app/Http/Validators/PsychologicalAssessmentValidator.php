<?php 
namespace Cie\Http\Validators;

use Cie\Exceptions\PsychologicalAssessmentException;
use Illuminate\Http\Request;
use Validator;
/**
* 
*/
class PsychologicalAssessmentValidator extends Validator implements ValidatorInterface
{
	private $request;

	public function __construct(Request $request)
	{
		$this->make($this->request = $request);
	}


	public function make(Request $request){
		
		$data = $request->all();

		$validator =  parent::make($data,$this->rules($request->method()),$this->messages($request->method()));
        if ($validator->fails()){
        	throw new PsychologicalAssessmentException(['title'=>'Error de validación','detail'=>$validator->errors()->toJson(),'level'=>'error'],422);        
        } else {
        	return true;
        } 
	}

	public function rules($method = null) {
		return [];
	}

	public function messages($method = null) {
		return [];
	}
}