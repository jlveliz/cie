<?php

namespace Cie\Http\Controllers;

use Cie\RepositoryInterface\BuildingTherapyUserRepositoryInterface;
use Cie\Http\Validators\BuildingTherapyUserValidator;
use Cie\Exceptions\BuildingTherapyUserException;
use Illuminate\Http\Request;

class BuildingTherapyUserController extends Controller
{
    
    protected $buildtUserRepo;


    public function __construct(BuildingTherapyUserRepositoryInterface $buildtUserRepo, Request $request)
    {
        $this->middleware('jwt.auth');
        parent::__construct($request);
        $this->buildtUserRepo = $buildtUserRepo;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $btures = $this->buildtUserRepo->enum($request->all())->toJson();
        $btures = $this->encodeResponse($btures);
        return response()->json($btures,200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(BuildingTherapyUserValidator $validator, Request $request)
    {
        try {
            $data = $request->all();
            $bture = $this->buildtUserRepo->save($data)->toJson();
            $bture = $this->encodeResponse($bture);
            return response()->json($bture,200);
        } catch (BuildingTherapyUserException $e) {
           
            return response()->json($this->encodeResponse($e->getMessage()),$e->getCode());
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
            $bture = $this->buildtUserRepo->find($id)->toJson();
            $bture = $this->encodeResponse($bture);
            return response()->json($bture,200);
        } catch (BuildingTherapyUserException $e) {
           
            return response()->json($this->encodeResponse(['title'=>$e->getMessage()]),$e->getCode());
        }
    }

   
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(BuildingTherapyUserValidator $validator, Request $request, $id)
    {
        try {
            $bture = $this->buildtUserRepo->edit($id, $request->all())->tojson();
            $bture = $this->encodeResponse($bture);
            return response()->json($bture,200);
        } catch (BuildingTherapyUserException $e) {
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
            $removed = $this->buildtUserRepo->remove($id);
            if ($removed) {
                $removed = $this->encodeResponse(json_encode(['exitoso'=>true]));
                return response()->json($removed,200);
            }
        } catch (BuildingTherapyUserException $e) {
            return response()->json($e->getMessage(),$e->getCode());
        }
    }
}
