<?php

namespace Cie\Http\Controllers;

use Cie\RepositoryInterface\UserRepositoryInterface;
use Cie\Http\Validators\UserValidator;
use Cie\Exceptions\UserException;
use Illuminate\Http\Request;

class UserController extends Controller
{
    
    protected $userRepo;


    public function __construct(UserRepositoryInterface $userRepo, Request $request)
    {
        parent::__construct($request);
        $this->middleware('jwt.auth');
        $this->userRepo = $userRepo;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $users = $this->userRepo->enum()->toJson();
        $users = $this->encodeResponse($users);
        return response()->json($users,200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(UserValidator $validator, Request $request)
    {
        try {
            $data = $request->all();
            $user = $this->userRepo->save($data)->toJson();
            $user = $this->encodeResponse($user);
            return response()->json($user,200);
        } catch (UserException $e) {
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
            $user = $this->userRepo->find($id)->toJson();
            $user = $this->encodeResponse($user);
            return response()->json($user,200);
        } catch (UserException $e) {
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
    public function update(UserValidator $validator, Request $request, $id)
    {
        try {
            $user = $this->userRepo->edit($id, $request->all())->toJson();
            $user = $this->encodeResponse($user);
            return response()->json($user,200);
        } catch (UserException $e) {
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
            $removed = $this->userRepo->remove($id);
            if ($removed) {
                $user = $this->encodeResponse(json_encode(['exitoso'=>true]));
                return response()->json($user,200);
            }
        } catch (UserException $e) {
            return response()->json($e->getMessage(),$e->getCode());
        }
    }
}
