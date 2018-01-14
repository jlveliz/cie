<?php

namespace Cie\Http\Controllers;

use Cie\RepositoryInterface\ProvinceRepositoryInterface;
use Cie\Http\Validators\ProvinceValidator;
use Cie\Exceptions\ProvinceException;
use Illuminate\Http\Request;

class ProvinceController extends Controller
{
    
    protected $provinceRepo;


    public function __construct(ProvinceRepositoryInterface $provinceRepo)
    {
        $this->middleware('jwt.auth');
        $this->provinceRepo = $provinceRepo;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $provinces = $this->provinceRepo->enum();
        return response()->json(['data'=>$provinces],200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ProvinceValidator $validator, Request $request)
    {
        try {
            $data = $request->all();
            $province = $this->provinceRepo->save($data);
            return response()->json($province,200);
        } catch (ProvinceException $e) {
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
            $province = $this->provinceRepo->find($id);
            return response()->json($province,200);
        } catch (ProvinceException $e) {
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
    public function update(ProvinceValidator $validator, Request $request, $id)
    {
        try {
            $province = $this->provinceRepo->edit($id, $request->all());
            return response()->json($province,200);
        } catch (ProvinceException $e) {
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
            $removed = $this->provinceRepo->remove($id);
            if ($removed) {
                return response()->json(['exitoso'=>true],200);
            }
        } catch (ProvinceException $e) {
            return response()->json($e->getMessage(),$e->getCode());
        }
    }
}
