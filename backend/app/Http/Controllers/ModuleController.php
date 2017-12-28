<?php

namespace Cie\Http\Controllers;

use Cie\RepositoryInterface\ModuleRepositoryInterface;
use Cie\Http\Validators\ModuleValidator;
use Cie\Exceptions\ModuleException;
use Illuminate\Http\Request;

class ModuleController extends Controller
{
    
    protected $moduleRepo;


    public function __construct(ModuleRepositoryInterface $moduleRepo)
    {
        $this->middleware('jwt.auth');
        $this->moduleRepo = $moduleRepo;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $modules = $this->moduleRepo->enum();
        return response()->json(['data'=>$modules],200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ModuleValidator $validator, Request $request)
    {
        try {
            $data = $request->all();
            $module = $this->moduleRepo->save($data);
            return response()->json($module,200);
        } catch (ModuleException $e) {
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
            $module = $this->moduleRepo->find($id);
            return response()->json($module,200);
        } catch (ModuleException $e) {
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
    public function update(ModuleValidator $validator, Request $request, $id)
    {
        try {
            $module = $this->moduleRepo->edit($id, $request->all());
            return response()->json($module,200);
        } catch (ModuleException $e) {
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
            $removed = $this->moduleRepo->remove($id);
            if ($removed) {
                return response()->json(['exitoso'=>true],200);
            }
        } catch (ModuleException $e) {
            return response()->json($e->getMessage(),$e->getCode());
        }
    }
}
