<?php 
namespace Cie\Http\Validators;

use Cie\Exceptions\PhysicalAssessmentException;
use Illuminate\Http\Request;
use Validator;
/**
* 
*/
class PhysicalAssessmentValidator extends Validator implements ValidatorInterface
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
        	throw new PhysicalAssessmentException(['title'=>'Error de validación','detail'=>$validator->errors()->toJson(),'level'=>'error'],422);        
        } else {
        	return true;
        } 
	}

	public function rules($method = null) {
		return [
			'patient_user_id' =>'required|exists:patient_user,id',
			'user_created_id' => 'required|exists:user,id',
			'date_eval' => 'required|date',
			'position' => 'required',
			'muscular_tone_general' => 'required',
			'muscular_tone' => 'required',
			'cephalic_control' => 'required',
			'column' => 'required'
		];
	}

	public function messages($method = null) {
		return [
			'patient_user_id.required' =>'Usuario requerido',
			'patient_user_id.exists' => 'El usuario que ingresa no existe',
			'user_created_id.required' => 'El evaluador es requerido',
			'user_created_id.exists' => 'El evaluador que ingresa la valoración no existe',
			'date_eval.required' => 'Fecha de Evaluación requerida',
			'position.required' => 'La posición del evaluado es requerida',
			'muscular_tone.required' => 'El Tono Muscular del evaluado es requerida',
			'muscular_tone_general.required' => 'El Tono Muscular General del evaluado es requerida',
			'cephalic_control.required' => 'El control Cefálico del evaluado es requerido',
			'column.required' => 'Los datos de la columna del evaluado es requerida'
		];
	}
}