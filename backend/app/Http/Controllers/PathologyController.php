<?php

namespace Cie\Http\Controllers;

use Cie\RepositoryInterface\PathologyRepositoryInterface;
use Cie\Http\Validators\PathologyValidator;
use Cie\Exceptions\PathologyException;
use Illuminate\Http\Request;

class PathologyController extends Controller
{
    
    protected $pathologyRepo;


    public function __construct(PathologyRepositoryInterface $pathologyRepo)
    {
        $this->middleware('jwt.auth');
        $this->PathologyRepo = $pathologyRepo;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $pathologies = $this->PathologyRepo->enum();
        return response()->json(['data'=>$pathologies],200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(PathologyValidator $validator, Request $request)
    {
        try {
            $data = $request->all();
            $pathology = $this->PathologyRepo->save($data);
            return response()->json($pathology,200);
        } catch (PathologyException $e) {
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
            $pathology = $this->PathologyRepo->find($id);
            return response()->json($pathology,200);
        } catch (PathologyException $e) {
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
    public function update(PathologyValidator $validator, Request $request, $id)
    {
        try {
            $pathology = $this->PathologyRepo->edit($id, $request->all());
            return response()->json($pathology,200);
        } catch (PathologyException $e) {
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
            $removed = $this->PathologyRepo->remove($id);
            if ($removed) {
                return response()->json(['exitoso'=>true],200);
            }
        } catch (PathologyException $e) {
            return response()->json($e->getMessage(),$e->getCode());
        }
    }
}
