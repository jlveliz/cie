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
                $requests = $this->requestRepo->paginate()->toJson();
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
            $module = $this->requestRepo->save($data)->toJson();
            $module = $this->encodeResponse($module);
            return response()->json($module,200);
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
            $module = $this->requestRepo->find($id)->toJson();
            $module = $this->encodeResponse($module);
            return response()->json($module,200);
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
    public function update(ModuleValidator $validator, Request $request, $id)
    {
        try {
            $module = $this->requestRepo->edit($id, $request->all())->tojson();
            $module = $this->encodeResponse($module);
            return response()->json($module,200);
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
