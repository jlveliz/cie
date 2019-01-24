<?php 
namespace Cie\Http\Validators;

use Cie\Exceptions\ModuleException;
use Illuminate\Http\Request;
use Validator;
/**
* 
*/
class RequestValidator extends Validator implements ValidatorInterface
{
	private $request;

	public function __construct(Request $request)
	{
		$this->make($this->request = $request);
	}


	public function make(Request $request){
        $validator =  parent::make($request->all(),$this->rules($request->method()),$this->messages($request->method()));
        if ($validator->fails()){
        	throw new ModuleException(['title'=>'Error de validación','detail'=>$validator->errors()->toJson(),'level'=>'error'],422);        
        } else {
        	return true;
        } 
	}

	public function rules($method = null) {
		$rules = [];
		if ($method == 'PUT') {
			$rules['begin_date'] = 'required';
			$rules['end_date'] = 'required';
		}

		return $rules;
	}

	public function messages($method = null) {
		return [
			'begin_date.required' => 'Por favor ingrese una fecha',
			'end_date.required'=>'Por favor ingrese una fecha',
			
		];
	}
}