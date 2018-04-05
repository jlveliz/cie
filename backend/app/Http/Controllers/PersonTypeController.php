<?php

namespace Cie\Http\Controllers;

use Cie\RepositoryInterface\PersonTypeRepositoryInterface;
use Cie\Http\Validators\PersonTypeValidator;
use Cie\Exceptions\PersonTypeException;
use Illuminate\Http\Request;

class PersonTypeController extends Controller
{
    
    protected $personTypeRepo;


    public function __construct(PersonTypeRepositoryInterface $personTypeRepo, Request $request)
    {
        parent::__construct($request);
        $this->middleware('jwt.auth');
        $this->personTypeRepo = $personTypeRepo;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $personTypes = $this->personTypeRepo->enum()->toJson();
        $personTypes = $this->encodeResponse($personTypes);
        return response()->json($personTypes,200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(PersonTypeValidator $validator, Request $request)
    {
        try {
            $data = $request->all();
            $personType = $this->personTypeRepo->save($data)->toJson();
            $personType = $this->encodeResponse($personType);
            return response()->json($personType,200);
        } catch (PersonTypeException $e) {
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
            $personType = $this->personTypeRepo->find($id)->toJson();
            $personType = $this->encodeResponse($personType);
            return response()->json($personType,200);
        } catch (PersonTypeException $e) {
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
    public function update(PersonTypeValidator $validator, Request $request, $id)
    {
        try {
            $personType = $this->personTypeRepo->edit($id, $request->all())->toJson();
            $personType = $this->encodeResponse($personType);
            return response()->json($personType,200);
        } catch (PersonTypeException $e) {
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
            $removed = $this->personTypeRepo->remove($id);
            if ($removed) {
                $personType = $this->encodeResponse(json_encode(['exitoso'=>true]));
                return response()->json($personType,200);
            }
        } catch (PersonTypeException $e) {
            return response()->json($e->getMessage(),$e->getCode());
        }
    }
}
