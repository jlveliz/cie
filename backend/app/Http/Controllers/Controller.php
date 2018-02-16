<?php

namespace Cie\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;

// custom
use JWTFactory;
use JWTAuth;

class Controller extends BaseController
{
    private $httpMethods = [
    	'POST',
    	'PUT',
    	'DELETE'
    ];

    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    function __construct(Request $request)
    {
    		
    	if(array_search($request->method(), $this->httpMethods) > -1) {
    		if($request->has('data')) {
    			$data = $this->decodeRequest($request->get('data'));
    			$request->replace($data);
    		}
    	}
    }


    public function encodeReponse($data)
    {
    	return base64_encode($data);
  
    }

    public function decodeRequest($data)
    {
    	$dataConv =  base64_decode($data);
    	$dataConv = json_decode($dataConv,true);
    	return (array) $dataConv;
    }
}