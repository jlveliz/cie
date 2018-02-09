<?php 
namespace Cie\Http\Validators;

use Cie\Exceptions\ProvinceException;
use Illuminate\Http\Request;
use Validator;
/**
* 
*/
class ProvinceValidator extends Validator implements ValidatorInterface
{
	private $request;

	public function __construct(Request $request)
	{
		dd($request->all());
		$this->make($this->request = $request);
	}


	public function make(Request $request){
		$validator =  parent::make($request->all(),$this->rules($request->method()),$this->messages($request->method()));
        if ($validator->fails()){
        	throw new ProvinceException(['title'=>'Error de validación','detail'=>$validator->errors()->toJson(),'level'=>'error'],422);        
        } else {
        	return true;
        } 
	}

	public function rules($method = null) {
		$rules = [
			'name' => 'required|unique:province,name',
		];

		if ($method == 'PUT') {
			$rules['name'] = 'required|unique:province,name,'.$this->request->get('key');
		}

		return $rules;
	}

	public function messages($method = null) {
		return [
			'name.required' => 'El nombre es requerido',
			'name.unique'=>'El nombre de la provincia ya fue tomado',
			
		];
	}
}