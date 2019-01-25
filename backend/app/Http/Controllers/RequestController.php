<?php

namespace Cie\Http\Controllers;

use Cie\RepositoryInterface\RequestRepositoryInterface;
use Cie\Http\Validators\RequestValidator;
use Cie\Exceptions\RequestException;
use Illuminate\Http\Request;

class RequestController extends Controller
{
    
    protected $requestRepo;


    public function __construct(RequestRepositoryInterface $requestRepo, Request $request)
    {
        $this->middleware('jwt.auth');
        // $this->middleware('checkrole:admin');
        parent::__construct($request);
        $this->requestRepo = $requestRepo;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        try {
            if ($request->has('page')) {
                $requests = $this->requestRepo->enum()->toJson();
            } else {
                $requests = $this->requestRepo->enum()->toJson();
            }
            $requests = $this->encodeResponse($requests);
        } catch (RequestException $e) {
            return response()->json($e->getMessage(),$e->getCode());
        }
        return response()->json($requests,200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(RequestValidator $validator, Request $request)
    {
        try {
            $data = $request->all();
            $request = $this->requestRepo->save($data)->toJson();
            $request = $this->encodeResponse($request);
            return response()->json($request,200);
        } catch (RequestException $e) {
            return response()->json($e->getMessage(),$e->getCode());
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        
        try {
            $request = $this->requestRepo->find($id)->toJson();
            $request = $this->encodeResponse($request);
            return response()->json($request,200);
        } catch (RequestException $e) {
            return response()->json($e->getMessage(),$e->getCode());
        }
    }

   
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(RequestValidator $validator, Request $request, $id)
    {
        try {
            $request = $this->requestRepo->edit($id, $request->all())->tojson();
            $request = $this->encodeResponse($request);
            return response()->json($request,200);
        } catch (RequestException $e) {
            return response()->json($e->getMessage(),$e->getCode());
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $removed = $this->requestRepo->remove($id);
            if ($removed) {
                $removed = $this->encodeResponse(json_encode(['exitoso'=>true]));
                return response()->json($removed,200);
            }
        } catch (RequestException $e) {
            return response()->json($e->getMessage(),$e->getCode());
        }
    }
}
