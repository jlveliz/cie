<?php 
namespace Cie\Http\Validators;

use Cie\Exceptions\ModuleException;
use Illuminate\Http\Request;
use Validator;
/**
* 
*/
class PersonTypeValidator extends Validator implements ValidatorInterface
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
		$rules = [
			'name' => 'required|unique:module,name',
		];

		if ($method == 'PUT') {
			$rules['name'] = 'required|unique:module,name,'.$this->request->get('key');
		}

		return $rules;
	}

	public function messages($method = null) {
		return [
			'name.required' => 'El nombre es requerido',
			'name.unique'=>'El nombre de Tipo de Persona ya fue tomado',
			
		];
	}
}