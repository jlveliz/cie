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
		return [
			'patient_user_id' =>'required|exists:patient_user,id',
			'user_created_id' => 'required|exists:user,id',
			'date_eval' => 'required|date',
		];
	}

	public function messages($method = null) {
		return [
			'patient_user_id.required' => 'Por favor, Ingrese un paciente',
			'patient_user_id.exists' => 'Por favor, ingrese un paciente existente',
			'user_created_id.required' => 'Por favor, ingrese un usario que ingresa la valoración',
			'user_created_id.exists' => 'Por favor, ingrese un usuario existente',
			'date_eval.required' => 'Ingrese una fecha de ingreso de la valoración',
			'date_eval.date' => 'Ingrese una fecha válida para la  valoración física',
		];
	}
}