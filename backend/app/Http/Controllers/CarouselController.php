<?php

namespace Cie\Http\Controllers;

use Cie\RepositoryInterface\CarouselRepositoryInterface;
use Cie\Http\Validators\CarouselValidator;
use Cie\Exceptions\CarouselException;
use Illuminate\Http\Request;

class CarouselController extends Controller
{
    
    protected $carouselRepo;


    public function __construct(CarouselRepositoryInterface $carouselRepo, Request $request)
    {
        parent::__construct($request);
        $this->middleware('jwt.auth');
        // $this->middleware('checkrole:admin',['except'=>['index']]);
        $this->carouselRepo = $carouselRepo;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $carousels = $this->carouselRepo->enum()->toJson();
        $carousels = $this->encodeResponse($carousels);
        return response()->json($carousels,200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CarouselValidator $validator, Request $request)
    {
        try {
            $data = $request->all();
            $carousel = $this->carouselRepo->save($data);
            $carousel = $this->encodeResponse($carousel->toJson());
            return response()->json($carousel,200);
        } catch (CarouselException $e) {
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
            $carousel = $this->carouselRepo->find($id)->toJson();
            $carousel = $this->encodeResponse($carousel);
            return response()->json($carousel,200);
        } catch (CarouselException $e) {
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
    public function update(CarouselValidator $validator, Request $request, $id)
    {
        try {
            $carousel = $this->carouselRepo->edit($id, $request->all())->toJson();
            $carousel = $this->encodeResponse($carousel);
            return response()->json($carousel,200);
        } catch (CarouselException $e) {
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
            $removed = $this->carouselRepo->remove($id);
            if ($removed) {
                $removed = $this->encodeResponse(json_encode(['exitoso'=>true]));
                return response()->json($removed,200);
            }
        } catch (CarouselException $e) {
            return response()->json($e->getMessage(),$e->getCode());
        }
    }
}
