<?php

namespace Cie\Http\Controllers;

use Cie\RepositoryInterface\PermissionTypeRepositoryInterface;
use Cie\Http\Validators\PermissionTypeValidator;
use Cie\Exceptions\PermissionTypeException;
use Illuminate\Http\Request;

class PermissionTypeController extends Controller
{
    
    protected $permissionTypeRepo;


    public function __construct(PermissionTypeRepositoryInterface $permissionTypeRepo)
    {
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
        $modules = $this->permissionTypeRepo->enum();
        return response()->json(['data'=>$modules],200);
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
            $module = $this->permissionTypeRepo->save($data);
            return response()->json($module,200);
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
            $module = $this->permissionTypeRepo->find($id);
            return response()->json($module,200);
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
            $module = $this->permissionTypeRepo->edit($id, $request->all());
            return response()->json($module,200);
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
