<?php
namespace Cie\Http\Validators;

use Illuminate\Http\Request;

interface ValidatorInterface {

	public function make(Request $request);

	public function rules($method = null);

	public function messages($method = null);

}