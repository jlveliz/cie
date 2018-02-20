<?php

namespace Cie\Http\Controllers;

use Cie\RepositoryInterface\PermissionRepositoryInterface;
use Cie\Http\Validators\PermissionValidator;
use Cie\Exceptions\PermissionException;
use Illuminate\Http\Request;

class PermissionController extends Controller
{
    
    protected $permissionRepo;


    public function __construct(PermissionRepositoryInterface $permissionRepo, Request $request)
    {
        parent::__construct($request);
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
        $permissions = $this->permissionRepo->enum($request->all())->toJson();
        $permissions = $this->encodeResponse($permissions);
        return response()->json($permissions,200);
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
            $permission = $this->permissionRepo->save($data)->toJson();
            $permission = $this->encodeResponse($permission);
            return response()->json($permission,200);
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
            $permission = $this->permissionRepo->find($id)->toJson();
            $permission = $this->encodeResponse($permission);
            return response()->json($permission,200);
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
            $permission = $this->permissionRepo->edit($id, $request->all())->toJson();
            $permission = $this->encodeResponse($permission);
            return response()->json($permission,200);
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
                $removed = $this->encodeResponse(json_encode(['exitoso'=>true]));
                return response()->json($removed,200);
            }
        } catch (PermissionException $e) {
            return response()->json($e->getMessage(),$e->getCode());
        }
    }
}
