<?php

namespace Cie\Http\Controllers;

use Cie\RepositoryInterface\TypeTherapyRepositoryInterface;
use Cie\Http\Validators\TherapyValidator;
use Cie\Exceptions\TypeTherapyException;
use Illuminate\Http\Request;

class TypeTherapyController extends Controller
{
    
    protected $typeTherapyRepo;


    public function __construct(TypeTherapyRepositoryInterface $typeTherapyRepo, Request $request)
    {
        $this->middleware('jwt.auth');
        // $this->middleware('checkrole:admin');
        parent::__construct($request);
        $this->typeTherapyRepo = $typeTherapyRepo;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $typeTherapies = $this->typeTherapyRepo->enum()->toJson();
        $typeTherapies = $this->encodeResponse($typeTherapies);
        return response()->json($typeTherapies,200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(TherapyValidator $validator, Request $request)
    {
        try {
            $data = $request->all();
            $typeTherapies = $this->typeTherapyRepo->save($data)->toJson();
            $typeTherapies = $this->encodeResponse($typeTherapies);
            return response()->json($typeTherapies,200);
        } catch (TypeTherapyException $e) {
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
            $typeTherapies = $this->typeTherapyRepo->find($id)->toJson();
            $typeTherapies = $this->encodeResponse($typeTherapies);
            return response()->json($typeTherapies,200);
        } catch (TypeTherapyException $e) {
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
    public function update(TherapyValidator $validator, Request $request, $id)
    {
        try {
            $typeTherapies = $this->typeTherapyRepo->edit($id, $request->all())->tojson();
            $typeTherapies = $this->encodeResponse($typeTherapies);
            return response()->json($typeTherapies,200);
        } catch (TypeTherapyException $e) {
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
            $removed = $this->typeTherapyRepo->remove($id);
            if ($removed) {
                $removed = $this->encodeResponse(json_encode(['exitoso'=>true]));
                return response()->json($removed,200);
            }
        } catch (TypeTherapyException $e) {
            return response()->json($e->getMessage(),$e->getCode());
        }
    }
}
