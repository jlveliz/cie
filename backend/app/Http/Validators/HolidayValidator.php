<?php 
namespace Cie\Http\Validators;

use Cie\Exceptions\HolidayTherapyUserException;
use Illuminate\Http\Request;
use Validator;
/**
* 
*/
class HolidayValidator extends Validator implements ValidatorInterface
{
	private $request;

	public function __construct(Request $request)
	{
		$this->make($this->request = $request);
	}


	public function make(Request $request){
		$validator =  parent::make($request->all(),$this->rules($request->method()),$this->messages($request->method()));
        if ($validator->fails()){
        	throw new HolidayTherapyUserException(['title'=>'Error de validación','detail'=>$validator->errors()->toJson(),'level'=>'error'],422);        
        } else {
        	return true;
        } 
	}

	public function rules($method = null) {
		// $rules = [
		// 	'name' => 'required|unique:building,name',
		// ];

		// if ($method == 'PUT') {
		// 	$rules['name'] = 'required|unique:building,name,'.$this->request->get('key');
  //       }
        
  //       $rules['schedule'] = 'required|array';

		// return $rules;

		return [];
	}

	public function messages($method = null) {
		return [
			'name.required' => 'El nombre es requerido',
			'name.unique'=>'El nombre de módulo ya fue tomado',
			'schedule.required'=>'Por favor, ingrese un horario',
			'schedule.array'=>'Horario Inválido',
		];
	}
}