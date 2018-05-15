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
		
		$data = $request->all();

		if (array_key_exists('father', $data)) {
			$data['father'] = json_decode($data['father'],true);
		}

		if (array_key_exists('mother', $data)) {
			$data['mother'] = json_decode($data['mother'],true);
		}

		if (array_key_exists('representant', $data)) {
			$data['representant'] = json_decode($data['representant'],true);
		}

		$validator =  parent::make($data,$this->rules($request->method()),$this->messages($request->method()));
        if ($validator->fails()){
        	throw new PatientUserException(['title'=>'Error de validación','detail'=>$validator->errors()->toJson(),'level'=>'error'],422);        
        } else {
        	return true;
        } 
	}

	public function rules($method = null) {

		// $rules = [
		// 	'num_identification' => 'required|min:10|max:10|is_valid_id',
		// 	'name'=>'required',
		// 	'last_name' => 'required',
		// 	'date_birth' => 'required|date',
		// 	'age'=>'required',
		// 	'genre'=>'required',
		// 	'address' =>'required|min:10',
		// 	'province_id' => 'required|exists:province,id',
		// 	'city_id' =>'required|exists:city,id',
		// 	'parish_id' =>'required|exists:parish,id',
		// 	'physical_disability' => 'required|int',
		// 	'intellectual_disability' => 'required|int',
		// 	'visual_disability' => 'required|int',
		// 	'hearing_disability' => 'required|int',
		// 	'psychosocial_disability' => 'required|int',
		// 	'conadis_id' => 'required',
		// 	'grade_of_disability' => 'required',
		// 	'has_diagnostic' => 'required|boolean',
		// 	'diagnostic_id' => 'required|exists:pathology,id',
		// 	'entity_send_diagnostic' => 'required',
		// 	'assist_other_therapeutic_center' => 'required|boolean',
		// 	'therapeutic_center_name'=>'required_if:assist_other_therapeutic_center,1',
		// 	'has_insurance'=>'required',
		// 	'receives_medical_attention' => 'required',
		// 	'name_medical_attention' => 'required_if:receives_medical_attention,6',
		// 	'schooling'=>'required',
		// 	'schooling_type'=>'required_if:schooling,< 3',
		// 	'schooling_name'=>'required_if:schooling,< 3',
		// 	'state'=>'required|int',
		// 	'has_father' => 'required',
		// 	'has_mother' => 'required',
		// 	'representant_identification_card'=>'file',
		// 	'user_identification_card'=>'file',
		// 	'conadis_identification_card'=>'file',
		// 	'specialist_certificate'=>'file'
		// ];

		$rules = [
			// 'num_identification' => 'min:10|max:10|is_valid_id',
			// 'date_birth' => 'date',
			// 'address' =>'min:10',
			// 'province_id' => 'exists:province,id',
			// 'city_id' =>'exists:city,id',
			// 'parish_id' =>'exists:parish,id',
			// 'physical_disability' => 'int',
			// 'intellectual_disability' => 'int',
			// 'visual_disability' => 'int',
			// 'hearing_disability' => 'int',
			// 'psychosocial_disability' => 'int',
			// 'has_diagnostic' => 'boolean',
			// 'diagnostic_id' => 'nullable|exists:pathology,id',
			// 'assist_other_therapeutic_center' => 'boolean',
			// 'state'=>'int',
			// 'representant_identification_card'=>'file',
			// 'user_identification_card'=>'file',
			// 'conadis_identification_card'=>'file',
			// 'specialist_certificate'=>'file'
		];

		// if($this->request->get('has_father') == 1) {
		// 	$rules['father'] = 'required|array';
		// 	$rules['father.num_identification'] = 'required|min:10|max:10|is_valid_id';
		// 	$rules['father.name'] = 'required';
		// 	$rules['father.last_name'] = 'required';
		// 	$rules['father.date_birth'] = 'required';
		// 	$rules['father.age'] = 'required|number_between:18,99';
		// 	$rules['father.mobile']='required|min:10|max:10';
		// 	$rules['father.activity'] = 'required';
		// }

		if($this->request->get('has_father') == 1) {
			$rules['father'] = 'array';
			$rules['father.num_identification'] = 'min:10|max:10|is_valid_id';
			$rules['father.age'] = 'number_between:18,99';
			$rules['father.mobile']='min:10|max:10';
		}

		// if($this->request->get('has_mother') == 1) {
		// 	$rules['mother'] = 'required|array';
		// 	$rules['mother.num_identification'] = 'required|min:10|max:10|is_valid_id';
		// 	$rules['mother.name'] = 'required';
		// 	$rules['mother.last_name'] = 'required';
		// 	$rules['mother.date_birth'] = 'required';
		// 	$rules['mother.age']='required|number_between:18,99';
		// 	$rules['mother.mobile'] = 'min:10|max:10';
		// 	$rules['mother.activity'] = 'required';
		// }

		if($this->request->get('has_mother') == 1) {
			$rules['mother'] = 'array';
			$rules['mother.num_identification'] = 'min:10|max:10|is_valid_id';
			$rules['mother.age']='number_between:18,99';
			$rules['mother.mobile'] = 'min:10|max:10';
		}

		
		return $rules;
	}

	public function messages($method = null) {
		return [
			'num_identification.required' => 'Identificación requerida',
			'num_identification.min' => 'Por favor, Escriba 10 carácteres',
			'num_identification.max' => 'Por favor, Escriba 10 carácteres',
			'num_identification.num_identification' => 'Por favor, ingrese una cédula válida',
			'name.required' => 'Por favor, ingrese un nombre de Usuario',
			'last_name.required' => 'Por favor, ingrese un apellido de Usuario',
			'date_birth.required' => 'Por favor, ingrese una fecha de nacimiento de Usuario',
			'date_birth.date_format' => 'Por favor, ingrese una fecha de nacimiento Válida',
			'age.required'=>'Por favor, ingrese una edad',
			'age.digits_between'=>'Por favor, ingrese una edad',
			'genre.required'=>'Por favor, ingrese un género de Usuario',
			'address.required' =>'Por favor, ingrese una dirección de Usuario',
			'address.min' =>'Por favor, ingrese al menos 10 carácteres de dirección',
			'province_id.required' => 'Por favor, ingrese una provincia',
			'province_id.exists' => 'Por favor, ingrese una provincia válida',
			'city_id.required' =>'Por favor, ingrese una ciudad',
			'city_id.exists' =>'Por favor, ingrese una ciudad válida',
			'parish_id.required' =>'Por favor, ingrese una parroquia',
			'parish_id.exists' =>'Por favor, ingrese una parroquia válida',
			'physical_disability.required' => 'Por favor, ingrese una discapacidad física',
			'physical_disability.int' => 'Por favor, ingrese una discapacidad física válida',
			'intellectual_disability.required' => 'Por favor, ingrese una discapacidad intelectual',
			'intellectual_disability.int' => 'Por favor, ingrese una discapacidad intelectual válida',
			'visual_disability.required' => 'Por favor, ingrese una discapacidad visual',
			'visual_disability.int' => 'Por favor, ingrese una discapacidad visual válida',
			'hearing_disability.required' => 'Por favor, ingrese una discapacidad auditiva',
			'hearing_disability.int' => 'Por favor, ingrese una discapacidad auditiva válida',
			'psychosocial_disability.required' => 'Por favor, ingrese una discapacidad psicosocial',
			'psychosocial_disability.int' => 'Por favor, ingrese una discapacidad visual psicosocial',
			'conadis_id.required' => 'Por favor, ingrese un carnet de Conadis',
			'grade_of_disability.required' => 'Por favor, ingrerse un grado de discapacidad',
			'has_diagnostic.required' => 'Por favor, ingrese un diagnóstico',
			'has_diagnostic.boolean' => 'Por favor, ingrese un diagnóstico válido',
			'diagnostic_id.required' => 'Por favor, ingrese un diagnóstico',
			'diagnostic_id.exists' => 'Por favor, ingrese un diagnóstico válido',
			'entity_send_diagnostic.required' => 'Por favor, ingrese un diagnóstico',
			'assist_other_therapeutic_center.required' => 'Por favor, ingrese la asistencia terapeutica del usuario',
			'therapeutic_center_name.required_if'=>'Por favor, ingrese el nombre del centro terapeutico',
			'has_insurance.required'=>'Por favor, ingrese si posee un seguro',
			'receives_medical_attention.required' => 'Por favor, ingrese donde recibe atención médica el usuario',
			'name_medical_attention.required_if' => 'Por favor, ingrese un nombre de donde recibe atención médica',
			'schooling.required' => 'Por favor, ingrese una escolarización del usuario',
			'schooling_type.required' => 'Por favor, ingrese un tipo de escolarización del usuario',
			'schooling_name.required' => 'Por favor, ingrese un nombre de escolarización',
			'state.required'=>'Por favor, ingrese un estado',
			'state.int'=>'Por favor, ingrese un estado correcto',
			'father.required' => 'Por favor, ingrese los datos del padre del usuario',
			'father.num_identification.required' => 'Por favor, ingrese un número de identificación del padre',
			'father.num_identification.min' => 'Por favor, ingrese un número de identificación del padre válido',
			'father.num_identification.max' => 'Por favor, ingrese un número de identificación del padre válido',
			'father.num_identification.is_valid_id' => 'Por favor, ingrese un número de identificación del padre válido',
			'father.name.required' => 'Por favor, ingrese un nombre del padre',
			'father.last_name.required' => 'Por favor, ingrese un apellido del padre',
			'father.date_birth.required' => 'Por favor, ingrese una fecha de nacimiento del padre',
			'father.date_birth.date_format' => 'Por favor, ingrese una fecha de nacimiento del padre válida',
			'father.age.required'=>'Por favor, ingrese una edad del padre',
			'father.age.number_between'=>'Por favor, ingrese una edad del padre válida',
			'father.mobile.required'=>'Por favor, ingrese un teléfono del padre',
			'father.mobile.min'=>'Por favor, ingrese un teléfono del padre válido',
			'father.mobile.max'=>'Por favor, ingrese un teléfono del padre válido',
			'father.activity.required' => 'Por favor, ingrese una actividad del padre',
			'father.activity.min' => 'Por favor, ingrese una actividad del padre de al menos 10 carácteres',
			'mother.required' => 'Por favor, ingrese los datos de la madre del usuario',
			'mother.num_identification.required' => 'Por favor, ingrese un número de identificación de la madre',
			'mother.num_identification.min' => 'Por favor, ingrese un número de identificación de la madre válido',
			'mother.num_identification.max' => 'Por favor, ingrese un número de identificación de la madre válido',
			'mother.num_identification.is_valid_id' => 'Por favor, ingrese un número de identificación de la madre válido',
			'mother.name.required' => 'Por favor, ingrese un nombre de la madre',
			'mother.last_name.required' => 'Por favor, ingrese un apellido de la madre',
			'mother.date_birth.required' => 'Por favor, ingrese una fecha de nacimiento de la madre',
			'mother.date_birth.date_format' => 'Por favor, ingrese una fecha de nacimiento de la madre válida',
			'mother.age.required'=>'Por favor, ingrese una edad de la madre',
			'mother.age.number_between'=>'Por favor, ingrese una edad de la madre válida',
			'mother.mobile.required'=>'Por favor, ingrese un teléfono de la madre',
			'mother.mobile.min'=>'Por favor, ingrese un teléfono de la madre válido',
			'mother.mobile.max'=>'Por favor, ingrese un teléfono de la madre válido',
			'mother.activity.required' => 'Por favor, ingrese una actividad de la madre',
			'mother.activity.min' => 'Por favor, ingrese una actividad de la madre de al menos 10 carácteres',
			'representant_identification_card.file'=>'La imagen es inválida',
			'user_identification_card.file'=>'La imagen es inválida',
			'conadis_identification_card.file'=>'La imagen es inválida',
			'specialist_certificate.file'=>'La imagen es inválida'
		];
	}
}