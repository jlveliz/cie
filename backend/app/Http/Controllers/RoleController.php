<?php

namespace Cie\Http\Controllers;

use Cie\RepositoryInterface\RoleRepositoryInterface;
use Cie\Http\Validators\RoleValidator;
use Cie\Exceptions\RoleException;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    
    protected $roleRepo;


    public function __construct(RoleRepositoryInterface $roleRepo)
    {
        // $this->middleware('jwt.auth');
        $this->roleRepo = $roleRepo;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $roles = $this->roleRepo->enum();
        return response()->json(['data'=>$roles],200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(RoleValidator $validator, Request $request)
    {
        try {
            $data = $request->all();
            $role = $this->roleRepo->save($data);
            return response()->json($role,200);
        } catch (RoleException $e) {
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
            $role = $this->roleRepo->find($id);
            return response()->json($role,200);
        } catch (RoleException $e) {
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
    public function update(RoleValidator $validator, Request $request, $id)
    {
        try {
            $role = $this->roleRepo->edit($id, $request->all());
            return response()->json($role,200);
        } catch (RoleException $e) {
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
            $removed = $this->roleRepo->remove($id);
            if ($removed) {
                return response()->json(['exitoso'=>true],200);
            }
        } catch (RoleException $e) {
            return response()->json($e->getMessage(),$e->getCode());
        }
    }
}
