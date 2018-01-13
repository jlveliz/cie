<?php

namespace Cie\Http\Controllers;

use Cie\RepositoryInterface\PermissionRepositoryInterface;
use Cie\Http\Validators\PermissionValidator;
use Cie\Exceptions\PermissionException;
use Illuminate\Http\Request;

class PermissionController extends Controller
{
    
    protected $permissionRepo;


    public function __construct(PermissionRepositoryInterface $permissionRepo)
    {
        $this->middleware('jwt.auth',['except'=>['index']]);
        $this->permissionRepo = $permissionRepo;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $modules = $this->permissionRepo->enum($request->all());
        return response()->json(['data'=>$modules],200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(PermissionValidator $validator, Request $request)
    {
        try {
            $data = $request->all();
            $module = $this->permissionRepo->save($data);
            return response()->json($module,200);
        } catch (PermissionException $e) {
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
            $module = $this->permissionRepo->find($id);
            return response()->json($module,200);
        } catch (PermissionException $e) {
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
    public function update(PermissionValidator $validator, Request $request, $id)
    {
        try {
            $module = $this->permissionRepo->edit($id, $request->all());
            return response()->json($module,200);
        } catch (PermissionException $e) {
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
            $removed = $this->permissionRepo->remove($id);
            if ($removed) {
                return response()->json(['exitoso'=>true],200);
            }
        } catch (PermissionException $e) {
            return response()->json($e->getMessage(),$e->getCode());
        }
    }
}
