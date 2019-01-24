<?php
namespace Cie\Http\Controllers;


use Illuminate\Http\Request;
use Cie\RepositoryInterface\PatientUserRepositoryInterface;
use Cie\RepositoryInterface\RequestRepositoryInterface;


/**
* 
*/
class DashboardController extends Controller
{

	private $patientUser;
	private $requestRepo;

	function __construct(PatientUserRepositoryInterface $patientUser, RequestRepositoryInterface $requestRepo)
	{
		$this->patientUser = $patientUser;
		$this->requestRepo = $requestRepo;
		$this->middleware('jwt.auth');
	}



	public function index()
	{
		$countPatientToday = $this->patientUser->getTotalUserToday();
		$requestsForView = $this->requestRepo->getRequestInserteds();
		$dates = $this->requestRepo->datesInAgend();
		return response()->json([
			'total_users_today'=>$countPatientToday,
			'requests_for_view'=>$requestsForView,
			'total_dates' =>$dates ],
		200);

	}


}