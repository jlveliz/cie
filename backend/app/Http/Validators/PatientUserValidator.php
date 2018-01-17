<?php 
namespace Cie\Http\Validators;

use Cie\Exceptions\PatientUserException;
use Illuminate\Http\Request;
use Validator;
/**
* 
*/
class PatientUserValidator extends Validator implements ValidatorInterface
{
	private $request;

	public function __construct(Request $request)
	{
		$this->make($this->request = $request);
	}


	public function make(Request $request){
		$validator =  parent::make($request->all(),$this->rules($request->method()),$this->messages($request->method()));
        if ($validator->fails()){
        	throw new PatientUserException(['title'=>'Error de validación','detail'=>$validator->errors()->toJson(),'level'=>'error'],422);        
        } else {
        	return true;
        } 
	}

	public function rules($method = null) {
		return [
			'num_identification' => 'required|min:10|max:10|is_valid_id',
			'name'=>'required',
			'last_name' => 'required',
			'date_birth' => 'required|date_format:Y-m-d',
			'age'=>'required|digits_between:0,15',
			'genre'=>'required|boolean',
			'address' =>'required|min:10',
			'province_id' => 'required|exists:province,id',
			'city_id' =>'required|exists:city,id',
			'physical_disability' => 'required|int',
			'intellectual_disability' => 'required|int',
			'visual_disability' => 'required|int',
			'psychosocial_disability' => 'required|int',
			'conadis_id' => 'required',
			'grade_of_disability' => 'required',
			'has_diagnostic' => 'required|boolean',
			'diagnostic_id' => 'required|exists:pathology,id',
			'entity_send_diagnostic' => 'required',
			'assist_other_therapeutic_center' => 'required|boolean',
			'therapeutic_center_name'=>'required_with:assist_other_therapeutic_center',
			'has_insurance'=>'required|boolean',
			'receives_medical_attention' => 'required',
			'name_medical_attention' => 'required_with:receives_medical_attention',
			'schooling'=>'required',
			'schooling_type'=>'required',
			'schooling_name'=>'required',
			
		];

		
		return $rules;
	}

	public function messages($method = null) {
		return [
			'num_identification.required' => 'Identificación requerida',
			'num_identification.min' => 'Identificación es inválida',
			'num_identification.is_valid_id' => 'Cédula Inválida'
		];
	}
}