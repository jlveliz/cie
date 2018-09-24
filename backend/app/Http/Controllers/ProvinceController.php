<?php

namespace Cie\Http\Controllers;

use Cie\RepositoryInterface\ProvinceRepositoryInterface;
use Cie\Http\Validators\ProvinceValidator;
use Cie\Exceptions\ProvinceException;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Token;

class ProvinceController extends Controller
{
    
    protected $provinceRepo;


    public function __construct(ProvinceRepositoryInterface $provinceRepo, Request $request)
    {
        parent::__construct($request);
        $this->middleware('jwt.auth');
        $this->middleware('checkrole:admin',['except'=>['index']]);
        $this->provinceRepo = $provinceRepo;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $provinces = $this->provinceRepo->enum()->toJson();
        $provinces = $this->encodeResponse($provinces);
        return response()->json($provinces,200);
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
            $province = $this->encodeResponse($province->toJson());
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
            $province = $this->provinceRepo->find($id)->toJson();
            $province = $this->encodeResponse($province);
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
            $province = $this->provinceRepo->edit($id, $request->all())->toJson();
            $province = $this->encodeResponse($province);
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
                $province = $this->encodeResponse(json_encode(['exitoso'=>true]));
                return response()->json($province,200);
            }
        } catch (ProvinceException $e) {
            return response()->json($e->getMessage(),$e->getCode());
        }
    }
}
