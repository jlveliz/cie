<?php

namespace Cie\Http\Controllers;

use Cie\RepositoryInterface\PsychologicalAssessmentRepositoryInterface;
use Cie\Http\Validators\PsychologicalAssessmentValidator; //TODO
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
    public function index(Request $request)
    {
        $psAsse = $this->psAsse->enum($request->all())->toJson();
        $psAsse = $this->encodeResponse($psAsse);
        return response()->json($psAsse,200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(PsychologicalAssessmentValidator $validator, Request $request)
    {
        try {
            $data = $request->all();
            $psAsse = $this->psAsse->save($data)->toJson();
            $psAsse = $this->encodeResponse($psAsse);
            return response()->json($psAsse,200);
        } catch (PsychologicalAssessmentException $e) {
            dd($e);
            $error = $this->encodeResponse($e->getMessage());
            return response()->json($error,$e->getCode());
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
        } catch (PsychologicalAssessmentException $e) {
            $error = $this->encodeResponse($e->getMessage());
            return response()->json($error,$e->getCode());
        }
    }

   
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(PsychologicalAssessmentValidator $validator, Request $request, $id)
    {
        try {
            $data = $request->all();
            
            $psAsse = $this->psAsse->edit($id, $data)->toJson();
            $psAsse = $this->encodeResponse($psAsse);
            return response()->json($psAsse,200);
        } catch (PsychologicalAssessmentException $e) {
            $error = $this->encodeResponse($e->getMessage());
            return response()->json($error,$e->getCode());
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
        } catch (PsychologicalAssessmentException $e) {
            return response()->json($e->getMessage(),$e->getCode());
        }
    }
}