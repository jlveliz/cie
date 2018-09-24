<?php

namespace Cie\Http\Controllers;

use Cie\RepositoryInterface\StatePatientUserRepositoryInterface;
use Cie\Http\Validators\StatePatientUserValidator;
use Cie\Exceptions\StatePatientUserException;
use Illuminate\Http\Request;

class StatePatientUserController extends Controller
{
    
    protected $stateRepo;


    public function __construct(StatePatientUserRepositoryInterface $stateRepo, Request $request)
    {
        parent::__construct($request);
        $this->middleware('jwt.auth');
        $this->middleware('checkrole:admin');
        $this->stateRepo = $stateRepo;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $states = $this->stateRepo->enum()->toJson();
        $states = $this->encodeResponse($states);
        return response()->json($states,200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StatePatientUserValidator $validator, Request $request)
    {
        try {
            $data = $request->all();
            $state = $this->stateRepo->save($data);
            $state = $this->encodeResponse($state->toJson());
            return response()->json($state,200);
        } catch (StatePatientUserException $e) {
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
            $state = $this->stateRepo->find($id)->toJson();
            $state = $this->encodeResponse($state);
            return response()->json($state,200);
        } catch (StatePatientUserException $e) {
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
    public function update(StatePatientUserValidator $validator, Request $request, $id)
    {
        try {
            $state = $this->stateRepo->edit($id, $request->all())->toJson();
            $state = $this->encodeResponse($state);
            return response()->json($state,200);
        } catch (StatePatientUserException $e) {
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
            $removed = $this->stateRepo->remove($id);
            if ($removed) {
                $removed = $this->encodeResponse(json_encode(['exitoso'=>true]));
                return response()->json($removed,200);
            }
        } catch (StatePatientUserException $e) {
            return response()->json($e->getMessage(),$e->getCode());
        }
    }
}
