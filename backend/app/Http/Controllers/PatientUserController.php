<?php

namespace Cie\Http\Controllers;

use Cie\RepositoryInterface\PatientUserRepositoryInterface;
use Cie\Http\Validators\PatientUserValidator;
use Cie\Exceptions\PatientUserException;
use Illuminate\Http\Request;

class PatientUserController extends Controller
{
    
    protected $pUserRepo;


    public function __construct(PatientUserRepositoryInterface $pUserRepo, Request $request)
    {
        parent::__construct($request);
        $this->middleware('jwt.auth');
        $this->pUserRepo = $pUserRepo;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $users = $this->pUserRepo->enum()->toJson();
        $users = $this->encodeResponse($users);
        return response()->json($users,200);
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
            $user = $this->pUserRepo->save($data)->toJson();
            $user = $this->encodeResponse($user);
            return response()->json($user,200);
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
            $user = $this->pUserRepo->find($id)->toJson();
            $user = $this->encodeResponse($user);
            return response()->json($user,200);
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
            $user = $this->pUserRepo->edit($id, $request->all())->toJson();
            $user = $this->encodeResponse($user);
            return response()->json($user,200);
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
            $removed = $this->pUserRepo->remove($id);
            if ($removed) {
                $user = $this->encodeResponse(json_encode(['exitoso'=>true]));
                return response()->json($user,200);
            }
        } catch (PatientUserException $e) {
            return response()->json($e->getMessage(),$e->getCode());
        }
    }
}
