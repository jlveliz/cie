<?php

namespace Cie\Http\Controllers;

use Cie\RepositoryInterface\ParishRepositoryInterface;
use Cie\Http\Validators\ParishValidator;
use Cie\Exceptions\ParishException;
use Illuminate\Http\Request;

class ParishController extends Controller
{
    
    protected $parishRepo;


    public function __construct(ParishRepositoryInterface $parishRepo, Request $request)
    {
        parent::__construct($request);
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
        $parishies = $this->parishRepo->enum()->toJson();
        $parishies = $this->encodeResponse($parishies);
        return response()->json($parishies,200);
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
            $parish = $this->parishRepo->save($data);
            $parish = $this->encodeResponse($parish->toJson());
            return response()->json($parish,200);
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
            $parish = $this->parishRepo->find($id)->toJson();
            $parish = $this->encodeResponse($parish);
            return response()->json($parish,200);
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
            $parish = $this->parishRepo->edit($id, $request->all())->toJson();
            $parish = $this->encodeResponse($parish);
            return response()->json($parish,200);
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
            $removed = $this->encodeResponse(json_encode(['exitoso'=>true]));
            if ($removed) {
                return response()->json($removed,200);
            }
        } catch (ParishException $e) {
            return response()->json($e->getMessage(),$e->getCode());
        }
    }
}
