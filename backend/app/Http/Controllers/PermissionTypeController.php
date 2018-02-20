<?php

namespace Cie\Http\Controllers;

use Cie\RepositoryInterface\PermissionTypeRepositoryInterface;
use Cie\Http\Validators\PermissionTypeValidator;
use Cie\Exceptions\PermissionTypeException;
use Illuminate\Http\Request;

class PermissionTypeController extends Controller
{
    
    protected $permissionTypeRepo;


    public function __construct(PermissionTypeRepositoryInterface $permissionTypeRepo, Request $request)
    {
        parent::__construct($request);
        $this->middleware('jwt.auth');
        $this->permissionTypeRepo = $permissionTypeRepo;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $permissions = $this->permissionTypeRepo->enum()->toJson();
        $permissions = $this->encodeResponse($permissions);
        return response()->json($permissions,200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(PermissionTypeValidator $validator, Request $request)
    {
        try {
            $data = $request->all();
            $permission = $this->permissionTypeRepo->save($data)->toJson();
            $permission = $this->encodeResponse($permission);
            return response()->json($permission,200);
        } catch (PermissionTypeException $e) {
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
            $permission = $this->permissionTypeRepo->find($id)->toJson();
            $permission = $this->encodeResponse($permission);
            return response()->json($permission,200);
        } catch (PermissionTypeException $e) {
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
    public function update(PermissionTypeValidator $validator, Request $request, $id)
    {
        try {
            $permission = $this->permissionTypeRepo->edit($id, $request->all())->toJson();
            $permission = $this->encodeResponse($permission);
            return response()->json($permission,200);
        } catch (PermissionTypeException $e) {
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
            $removed = $this->permissionTypeRepo->remove($id);
            if ($removed) {
                return response()->json(['exitoso'=>true],200);
            }
        } catch (PermissionTypeException $e) {
            return response()->json($e->getMessage(),$e->getCode());
        }
    }
}
