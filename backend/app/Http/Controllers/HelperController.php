<?php
namespace Cie\Http\Controllers;

use Illuminate\Http\Request;
use Cie\RepositoryInterface\ModuleRepositoryInterface;
use DB;
use JWTAuth;
use Auth;

/**
* 
*/
class HelperController extends Controller
{
	
	private $moduleRepo;

	public function __construct(ModuleRepositoryInterface $moduleRepo)
	{
		// $this->middleware('jwt.auth');
		$this->moduleRepo = $moduleRepo;
	}

	public function validation(Request $request,$method)
	{
		
		switch ($method) {
			case 'unique':
				$unique = $this->verifyUnique($request->get('table'),$request->get('columnname'),$request->get('value'),$request->get('id'));
				if ($unique) {
					return response()->json('exist',200);
				}
				return response()->json('ok',200);
				break;
			case 'exists': 
				$exists = $this->verifyExist($request->get('table'),$request->get('value'));
				if ($exists) return response()->json('ok',200);
				return response()->json('no-exist',200);
			case 'uniquePatient': 
				$unique = $this->verifyPatient($request->get('columnname'),$request->get('value'));
				if ($unique) {
					return response()->json('exist',200);
				}
				return response()->json('ok',200);
			default:
				# code...
				break;
		}
	}


	private function verifyUnique($table,$columnKey,$columnValue, $key = null) {
		if (!$key) {
			$exist = DB::table($table)->where($columnKey,$columnValue)->first();
		} else {
			$exist = DB::table($table)->where($columnKey,$columnValue)->where('id','<>',$key)->first();
		}
		if($exist) return true;
		return false;
	}

	public function verifyExist($tableName,$value)
	{
		$exist = DB::table($tableName)->where('id',$value)->first();
		return $exist;
	}

	

	public function verifyPatient($columnName,$value)
	{
		$exist = DB::table('patient_user')->join('person','person.id','=','patient_user.person_id')->whereRaw("person.".$columnName.'='.$value)->first();
		if($exist) return true;
		return false;
	}




	/**
		LOAD MENU 
	**/
	public function loadMenu()
	{
		if (JWTAuth::parseToken()->authenticate()) {
			$user = Auth::user();
			if ($user->super_admin) {
				$menu = $this->moduleRepo->loadAdminMenu();
			} else{
				$menu = $this->moduleRepo->loadMenu($user->id);
			}
			return response()->json($menu,200);
		}
	}
}