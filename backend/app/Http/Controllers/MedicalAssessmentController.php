<?php

namespace Cie\Http\Controllers;

use Cie\RepositoryInterface\MedicalAssessmentRepositoryInterface;
use Cie\Http\Validators\MedicalAssessmentValidator; //TODO
use Cie\Exceptions\MedicalAssessmentException;
use Illuminate\Http\Request;



class MedicalAssessmentController extends Controller
{
    
    protected $psAsse;


    public function __construct(MedicalAssessmentRepositoryInterface $psAsse, Request $request)
    {
        $this->middleware('jwt.auth');
        $this->middleware('checkrole:admin,dr-val-medica,dirTerapia');
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
    public function store(MedicalAssessmentValidator $validator, Request $request)
    {
        try {
            $data = $request->all();
            $psAsse = $this->psAsse->save($data)->toJson();
            $psAsse = $this->encodeResponse($psAsse);
            return response()->json($psAsse,200);
        } catch (MedicalAssessmentException $e) {
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
        } catch (MedicalAssessmentException $e) {
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
    public function update(MedicalAssessmentValidator $validator, Request $request, $id)
    {
        try {
            $data = $request->all();
            
            $psAsse = $this->psAsse->edit($id, $data)->toJson();
            $psAsse = $this->encodeResponse($psAsse);
            return response()->json($psAsse,200);
        } catch (MedicalAssessmentException $e) {
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
        } catch (MedicalAssessmentException $e) {
            return response()->json($e->getMessage(),$e->getCode());
        }
    }
}