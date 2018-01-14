<?php 
namespace Cie\Http\Validators;

use Cie\Exceptions\CityException;
use Illuminate\Http\Request;
use Validator;
/**
* 
*/
class CityValidator extends Validator implements ValidatorInterface
{
	private $request;

	public function __construct(Request $request)
	{
		$this->make($this->request = $request);
	}


	public function make(Request $request){
		$validator =  parent::make($request->all(),$this->rules($request->method()),$this->messages($request->method()));
        if ($validator->fails()){
        	throw new CityException(['title'=>'Error de validación','detail'=>$validator->errors()->toJson(),'level'=>'error'],422);        
        } else {
        	return true;
        } 
	}

	public function rules($method = null) {
		$rules = [
			'name' => 'required',
			'province_id'=>'required|exists:province,id'
		];

		return $rules;
	}

	public function messages($method = null) {
		return [
			'name.required' => 'El nombre es requerido',
			'province_id.required' => 'La provincia de la ciudad es requerida',
			'province_id.exists' => 'La provincia ingresada es inválida',
		];
	}
}