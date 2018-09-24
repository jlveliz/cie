<?php

namespace Cie\Http\Controllers;

use Cie\RepositoryInterface\IdentificationTypeRepositoryInterface;
use Cie\Http\Validators\IdentificationTypeValidator;
use Cie\Exceptions\IdentificationTypeException;
use Illuminate\Http\Request;

class IdentificationTypeController extends Controller
{
    
    protected $identifyTypeRepo;


    public function __construct(IdentificationTypeRepositoryInterface $identifyTypeRepo, Request $request)
    {
        parent::__construct($request);
        $this->middleware('jwt.auth');
        $this->middleware('checkrole:admin');
        $this->identifyTypeRepo = $identifyTypeRepo;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $identificationTypes = $this->identifyTypeRepo->enum()->toJson();
        $identificationTypes = $this->encodeResponse($identificationTypes);
        return response()->json($identificationTypes,200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(IdentificationTypeValidator $validator, Request $request)
    {
        try {
            $data = $request->all();
            $identificationType = $this->identifyTypeRepo->save($data)->toJson();
            $identificationType = $this->encodeResponse($identificationType);
            return response()->json($identificationType,200);
        } catch (IdentificationTypeException $e) {
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
            $identificationType = $this->identifyTypeRepo->find($id)->toJson();
            $identificationType = $this->encodeResponse($identificationType);
            return response()->json($identificationType,200);
        } catch (IdentificationTypeException $e) {
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
    public function update(IdentificationTypeValidator $validator, Request $request, $id)
    {
        try {
            $identificationType = $this->identifyTypeRepo->edit($id, $request->all())->toJson();
            $identificationType = $this->encodeResponse($identificationType);
            return response()->json($identificationType,200);
        } catch (IdentificationTypeException $e) {
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
            $removed = $this->identifyTypeRepo->remove($id);
            if ($removed) {
                $identificationType = $this->encodeResponse(json_encode(['exitoso'=>true]));
                return response()->json($identificationType,200);
            }
        } catch (IdentificationTypeException $e) {
            return response()->json($e->getMessage(),$e->getCode());
        }
    }
}
