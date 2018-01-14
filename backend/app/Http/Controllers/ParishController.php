<?php

namespace Cie\Http\Controllers;

use Cie\RepositoryInterface\ParishRepositoryInterface;
use Cie\Http\Validators\ParishValidator;
use Cie\Exceptions\ParishException;
use Illuminate\Http\Request;

class ParishController extends Controller
{
    
    protected $parishRepo;


    public function __construct(ParishRepositoryInterface $parishRepo)
    {
        $this->middleware('jwt.auth');
        $this->parishRepo = $parishRepo;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $cities = $this->parishRepo->enum();
        return response()->json(['data'=>$cities],200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ParishValidator $validator, Request $request)
    {
        try {
            $data = $request->all();
            $city = $this->parishRepo->save($data);
            return response()->json($city,200);
        } catch (ParishException $e) {
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
            $city = $this->parishRepo->find($id);
            return response()->json($city,200);
        } catch (ParishException $e) {
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
    public function update(ParishValidator $validator, Request $request, $id)
    {
        try {
            $city = $this->parishRepo->edit($id, $request->all());
            return response()->json($city,200);
        } catch (ParishException $e) {
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
            $removed = $this->parishRepo->remove($id);
            if ($removed) {
                return response()->json(['exitoso'=>true],200);
            }
        } catch (ParishException $e) {
            return response()->json($e->getMessage(),$e->getCode());
        }
    }
}
