<?php

namespace Cie\Http\Controllers;

use Cie\RepositoryInterface\TherapistRepositoryInterface;
// use Cie\Http\Validators\TherapistValidator;
use Cie\Exceptions\TherapistException;
use Illuminate\Http\Request;

class TherapistController extends Controller
{
    
    protected $therapistRepo;


    public function __construct(TherapistRepositoryInterface $therapistRepo, Request $request)
    {
        $this->middleware('jwt.auth');
        // $this->middleware('checkrole:admin');
        parent::__construct($request);
        $this->therapistRepo = $therapistRepo;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $therapists = $this->therapistRepo->enum()->toJson();
        $therapists = $this->encodeResponse($therapists);
        return response()->json($therapists,200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // try {
        //     $data = $request->all();
        //     $therapists = $this->therapistRepo->save($data)->toJson();
        //     $therapists = $this->encodeResponse($therapists);
        //     return response()->json($therapists,200);
        // } catch (TherapistException $e) {
        //     return response()->json($e->getMessage(),$e->getCode());
        // }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        
        // try {
        //     $therapists = $this->therapistRepo->find($id)->toJson();
        //     $therapists = $this->encodeResponse($therapists);
        //     return response()->json($therapists,200);
        // } catch (TherapistException $e) {
        //     return response()->json($e->getMessage(),$e->getCode());
        // }
    }

   
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        // try {
        //     $therapists = $this->therapistRepo->edit($id, $request->all())->tojson();
        //     $therapists = $this->encodeResponse($therapists);
        //     return response()->json($therapists,200);
        // } catch (TherapistException $e) {
        //     return response()->json($e->getMessage(),$e->getCode());
        // }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        // try {
        //     $removed = $this->therapistRepo->remove($id);
        //     if ($removed) {
        //         $removed = $this->encodeResponse(json_encode(['exitoso'=>true]));
        //         return response()->json($removed,200);
        //     }
        // } catch (TherapistException $e) {
        //     return response()->json($e->getMessage(),$e->getCode());
        // }
    }
}
