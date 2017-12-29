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
}