<?php 
namespace Cie\Http\Validators;

use Cie\Exceptions\UserException;
use Illuminate\Http\Request;
use Validator;
/**
* 
*/
class UserValidator extends Validator implements ValidatorInterface
{
	
	public function make(Request $request){
		$credentials = $request->only('username','password');
		$validator =  parent::make($credentials,$this->rules(),$this->messages());
        if ($validator->fails()){
        	throw new UserException(['title'=>'Error de validación','detail'=>$validator->errors()->toJson(),'level'=>'error'],422);        
        } else {
        	return true;
        } 
	}

	public function rules($method = null) {
		$rules = [
			'name' => 'required',
			'last_name'=>'required',
			'username'=>'required|unique:user,username',
			'password'=>'required',
			'repeat_password'=>'required|same:required',
			'email'=>'required|email|unique:person,email'
		];

		if ($method == 'PUT') {
			$rules['email'] = 'required|email|unique:person,email';
		}

		return $rules;
	}

	public function messages($method = null) {
		return [
			'name.required' => 'El nombre es requerido',
			'last_name.required' => 'EL apellido es requerido',
			'username.required'=>'El usuario es requerido',
			'username.unique'=>'El usuario ya fue tomado',
			'password.required'=>'La contraseña es requerida',
			'repeat_password.required'=>'La confirmación de contraseña es requerida',
			'repeat_password.same'=>'La confirmación de contraseña no coincide con la contraseña',
			'email.required' => 'El email es requerido',
			'email.email' => 'El email tiene un formato inválido',
			'email.unique' => 'El email ya fue tomado',
		];
	}
}