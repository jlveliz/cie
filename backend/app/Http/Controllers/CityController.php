<?php

namespace Cie\Http\Controllers;

use Cie\RepositoryInterface\CityRepositoryInterface;
use Cie\Http\Validators\CityValidator;
use Cie\Exceptions\CityException;
use Illuminate\Http\Request;

class CityController extends Controller
{
    
    protected $cityRepo;


    public function __construct(CityRepositoryInterface $cityRepo, Request $request)
    {
        parent::__construct($request);
        $this->middleware('jwt.auth');
        $this->cityRepo = $cityRepo;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $cities = $this->cityRepo->enum()->toJson();
        $cities = $this->encodeResponse($cities);
        return response()->json($cities,200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CityValidator $validator, Request $request)
    {
        try {
            $data = $request->all();
            $city = $this->cityRepo->save($data);
            $city = $this->encodeResponse($city->toJson());
            return response()->json($city,200);
        } catch (CityException $e) {
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
            $city = $this->cityRepo->find($id)->toJson();
            $city = $this->encodeResponse($city);
            return response()->json($city,200);
        } catch (CityException $e) {
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
    public function update(CityValidator $validator, Request $request, $id)
    {
        try {
            $city = $this->cityRepo->edit($id, $request->all())->toJson();
            $city = $this->encodeResponse($city);
            return response()->json($city,200);
        } catch (CityException $e) {
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
            $removed = $this->cityRepo->remove($id);
            if ($removed) {
                $removed = $this->encodeResponse(json_encode(['exitoso'=>true]));
                return response()->json($removed,200);
            }
        } catch (CityException $e) {
            return response()->json($e->getMessage(),$e->getCode());
        }
    }
}
