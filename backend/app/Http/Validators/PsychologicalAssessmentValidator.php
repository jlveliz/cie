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
			'call_user_in_home' => 'required',
			'date_eval' => 'required',
			// 'reason_consultation' => 'required',
			// 'background' => 'required',
			// 'current_situation' => 'required',
			// 'description_beneficiary' => 'required'
		];
	}

	public function messages($method = null) {
		return [
			'patient_user_id.required' => 'Por favor, Ingrese un paciente',
			'patient_user_id.exists' => 'Por favor, ingrese un paciente existente',
			'call_user_in_home.required' => 'Por favor ingrese como lo llaman en casa',
			'date_eval.required' => 'Fecha de inscripción requerida',
			'reason_consultation.required' => 'Por favor, escriba un motivo de de consulta',
			'background.required' => 'Por favor, escriba un antecedente de la consulta',
			'current_situation.required' => 'Por favor, escriba la situación actual',
			'description_beneficiary.required' => 'Por favor, escriba una descripción del beneficiario'
		];
	}
}