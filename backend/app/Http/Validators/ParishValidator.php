<?php 
namespace Cie\Http\Validators;

use Cie\Exceptions\ParishException;
use Illuminate\Http\Request;
use Validator;
/**
* 
*/
class ParishValidator extends Validator implements ValidatorInterface
{
	private $request;

	public function __construct(Request $request)
	{
		$this->make($this->request = $request);
	}


	public function make(Request $request){
		$validator =  parent::make($request->all(),$this->rules($request->method()),$this->messages($request->method()));
        if ($validator->fails()){
        	throw new ParishException(['title'=>'Error de validación','detail'=>$validator->errors()->toJson(),'level'=>'error'],422);        
        } else {
        	return true;
        } 
	}

	public function rules($method = null) {
		$rules = [
			'name' => 'required',
			'city_id'=>'required|exists:city,id'
		];

		return $rules;
	}

	public function messages($method = null) {
		return [
			'name.required' => 'El nombre es requerido',
			'city_id.required' => 'La Ciudad o Cantón de la parroquia es requerida',
			'city_id.exists' => 'La Ciudad ingresada es inválida',
		];
	}
}