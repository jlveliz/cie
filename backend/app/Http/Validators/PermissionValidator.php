<?php 
namespace Cie\Http\Validators;

use Cie\Exceptions\PermissionException;
use Illuminate\Http\Request;
use Validator;
/**
* 
*/
class PermissionValidator extends Validator implements ValidatorInterface
{
	private $request;

	public function __construct(Request $request)
	{
		$this->make($this->request = $request);
	}


	public function make(Request $request){
		$validator =  parent::make($request->all(),$this->rules($request->method()),$this->messages($request->method()));
        if ($validator->fails()){
        	throw new PermissionException(['title'=>'Error de validación','detail'=>$validator->errors()->toJson(),'level'=>'error'],422);        
        } else {
        	return true;
        } 
	}

	public function rules($method = null) {
		$rules = [
			'name' => 'required|unique:permission,name',
			'module_id' => 'required|exists:module,id',
			'parent_id' => 'exists:permission,id',
			'type_id' => 'required|exists:permission_type,id',
			'description' => 'required',
		];

		if ($method == 'PUT') {
			$rules['name'] = 'required|unique:permission,name,'.$this->request->get('key');
		}

		return $rules;
	}

	public function messages($method = null) {
		return [
			'name.required' => 'El nombre es requerido',
			'name.unique'=>'El nombre de permiso ya fue tomado',
			'module_id.required'=> 'El módulo es requerido',
			'module_id.exists'=> 'El módulo es inválido',
			'parent_id.exists'=> 'El permiso padre es inválido',
			'type_id.required' => 'El tipo es requerido',
			'description.required' => 'La descripción es requerida'
		];
	}
}