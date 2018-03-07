<?php
namespace Cie\Http\Controllers;


use Illuminate\Http\Request;
use Cie\RepositoryInterface\PatientUserRepositoryInterface;


/**
* 
*/
class DashboardController extends Controller
{

	private $patientUser;

	function __construct(PatientUserRepositoryInterface $patientUser)
	{
		$this->patientUser = $patientUser;
		$this->middleware('jwt.auth');
	}



	public function index()
	{
		$countPatientToday = $this->patientUser->getTotalUserToday();
		return response()->json(['total_users_today'=>$countPatientToday],200);

	}


}