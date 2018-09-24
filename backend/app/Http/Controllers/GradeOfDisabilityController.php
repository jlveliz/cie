<?php

namespace Cie\Http\Controllers;

use Cie\RepositoryInterface\GradeOfDisabilityRepositoryInterface;
use Cie\Http\Validators\GradeOfDisabilityValidator;
use Cie\Exceptions\GradeOfDisabilityException;
use Illuminate\Http\Request;

class GradeOfDisabilityController extends Controller
{
    
    protected $grade;


    public function __construct(GradeOfDisabilityRepositoryInterface $grade, Request $request)
    {
        parent::__construct($request);
        $this->middleware('jwt.auth');
        $this->middleware('checkrole:admin');
        $this->grade = $grade;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $grades = $this->grade->enum()->toJson();
        $grades = $this->encodeResponse($grades);
        return response()->json($grades,200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(GradeOfDisabilityValidator $validator, Request $request)
    {
        try {
            $data = $request->all();
            $grade = $this->grade->save($data);
            $grade = $this->encodeResponse($grade->toJson());
            return response()->json($grade,200);
        } catch (GradeOfDisabilityException $e) {
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
            $grade = $this->grade->find($id)->toJson();
            $grade = $this->encodeResponse($grade);
            return response()->json($grade,200);
        } catch (GradeOfDisabilityException $e) {
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
    public function update(GradeOfDisabilityValidator $validator, Request $request, $id)
    {
        try {
            $grade = $this->grade->edit($id, $request->all())->toJson();
            $grade = $this->encodeResponse($grade);
            return response()->json($grade,200);
        } catch (GradeOfDisabilityException $e) {
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
            $removed = $this->grade->remove($id);
            if ($removed) {
                $removed = $this->encodeResponse(json_encode(['exitoso'=>true]));
                return response()->json($removed,200);
            }
        } catch (GradeOfDisabilityException $e) {
            return response()->json($e->getMessage(),$e->getCode());
        }
    }
}
