<?php
namespace Cie\Http\Controllers;

use Illuminate\Http\Request;
use DB;

/**
* 
*/
class HelperController extends Controller
{
	
	public function validation(Request $request,$method)
	{
		
		switch ($method) {
			case 'unique':
				$exist = $this->verifyUnique($request->get('table'),$request->get('columnname'),$request->get('value'),$request->get('id'));
				if ($exist) {
					return response()->json('exist',200);
				}
				return response()->json('ok',200);
				break;
			
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
}