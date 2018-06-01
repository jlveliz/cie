<?php

namespace Cie\Http\Controllers;

use Cie\RepositoryInterface\PsychologicalAssessmentRepositoryInterface;
use Cie\Http\Validators\PatientUserValidator; //TODO
use Cie\Exceptions\PsychologicalAssessmentException;
use Illuminate\Http\Request;



class PsychologicalAssessmentController extends Controller
{
    
    protected $psAsse;


    public function __construct(PsychologicalAssessmentRepositoryInterface $psAsse, Request $request)
    {
        $this->middleware('jwt.auth');
        parent::__construct($request);
        $this->psAsse = $psAsse;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $psAsse = $this->psAsse->enum()->toJson();
        $psAsse = $this->encodeResponse($psAsse);
        return response()->json($psAsse,200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(PatientUserValidator $validator, Request $request)
    {
        try {
            $data = $request->all();
            $psAsse = $this->psAsse->save($data)->toJson();
            $psAsse = $this->encodeResponse($psAsse);
            return response()->json($psAsse,200);
        } catch (PatientUserException $e) {
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
            $psAsse = $this->psAsse->find($id)->toJson();
            $psAsse = $this->encodeResponse($psAsse);
            return response()->json($psAsse,200);
        } catch (PatientUserException $e) {
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
    public function update(PatientUserValidator $validator, Request $request, $id)
    {
        try {
            $data = $request->all();
            
            $psAsse = $this->psAsse->edit($id, $data)->toJson();
            $psAsse = $this->encodeResponse($psAsse);
            return response()->json($psAsse,200);
        } catch (PatientUserException $e) {
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
            $removed = $this->psAsse->remove($id);
            if ($removed) {
                $psAsse = $this->encodeResponse(json_encode(['exitoso'=>true]));
                return response()->json($psAsse,200);
            }
        } catch (PatientUserException $e) {
            return response()->json($e->getMessage(),$e->getCode());
        }
    }
}