<?php

namespace Cie\Http\Controllers;

use Cie\RepositoryInterface\BuildingTherapyAvailableRepositoryInterface;
use Cie\Http\Validators\BuildingTherapyValidator;
use Cie\Exceptions\BuildingTherapyException;
use Illuminate\Http\Request;

class BuildingTherapyAvailableController extends Controller
{
    
    protected $buildingRepo;


    public function __construct(BuildingTherapyAvailableRepositoryInterface $buildingRepo, Request $request)
    {
        $this->middleware('jwt.auth');
        // $this->middleware('checkrole:admin');
        parent::__construct($request);
        $this->buildingRepo = $buildingRepo;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($buildinTherapyId)
    {
        $building = $this->buildingRepo->setParent($buildinTherapyId)->enum()->toJson();
        $building = $this->encodeResponse($building);
        return response()->json($building,200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(BuildingTherapyValidator $validator, Request $request, $buildId)
    {
        try {
            $data = $request->all();
            $building = $this->buildingRepo->save($data)->toJson();
            $building = $this->encodeResponse($building);
            return response()->json($building,200);
        } catch (BuildingTherapyException $e) {
            return response()->json($e->getMessage(),$e->getCode());
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($buildId,$id)
    {
        
        try {
            $building = $this->buildingRepo->find($id)->toJson();
            $building = $this->encodeResponse($building);
            return response()->json($building,200);
        } catch (BuildingTherapyException $e) {
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
    public function update(BuildingTherapyValidator $validator, Request $request, $id)
    {
        try {
            $building = $this->buildingRepo->edit($id, $request->all())->tojson();
            $building = $this->encodeResponse($building);
            return response()->json($building,200);
        } catch (BuildingTherapyException $e) {
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
            $removed = $this->buildingRepo->remove($id);
            if ($removed) {
                $removed = $this->encodeResponse(json_encode(['exitoso'=>true]));
                return response()->json($removed,200);
            }
        } catch (BuildingTherapyException $e) {
            return response()->json($e->getMessage(),$e->getCode());
        }
    }
}