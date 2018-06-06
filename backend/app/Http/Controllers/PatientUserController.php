<?php

namespace Cie\Http\Controllers;

use Cie\RepositoryInterface\PatientUserRepositoryInterface;
use Cie\Http\Validators\PatientUserValidator;
use Cie\Exceptions\PatientUserException;
use Illuminate\Http\Request;



class PatientUserController extends Controller
{
    
    protected $pUserRepo;


    public function __construct(PatientUserRepositoryInterface $pUserRepo, Request $request)
    {
        $this->middleware('jwt.auth',['except'=>['import']]);
        parent::__construct($request);
        $this->pUserRepo = $pUserRepo;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        try {
            $users = $this->pUserRepo->enum($request->all())->toJson();
            $users = $this->encodeResponse($users);
            return response()->json($users,200);
        } catch (PatientUserException $e) {
            return response()->json(['message'=>$e->getMessage()],$e->getCode());
        }catch (\Exception $e) {
            
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(PatientUserValidator $validator, Request $request)
    {
        try {
            $data = $request->all();
            
            if (array_key_exists('father', $data)) {
                $data['father'] = json_decode($data['father'],true);
            }

            if (array_key_exists('mother', $data)) {
                $data['mother'] = json_decode($data['mother'],true);
            }

            if (array_key_exists('representant', $data)) {
                $data['representant'] = json_decode($data['representant'],true);
            }

            $user = $this->pUserRepo->save($data)->toJson();
            $user = $this->encodeResponse($user);
            return response()->json($user,200);
        } catch (PatientUserException $e) {
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
            $user = $this->pUserRepo->find($id)->toJson();
            $user = $this->encodeResponse($user);
            return response()->json($user,200);
        } catch (PatientUserException $e) {
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
    public function update(PatientUserValidator $validator, Request $request, $id)
    {
        try {
            $data = $request->all();
            if (array_key_exists('father', $data)) {
                $data['father'] = json_decode($data['father'],true);
            }

            if (array_key_exists('mother', $data)) {
                $data['mother'] = json_decode($data['mother'],true);
            }

            if (array_key_exists('representant', $data)) {
                $data['representant'] = json_decode($data['representant'],true);
            }
            $user = $this->pUserRepo->edit($id, $data)->toJson();
            $user = $this->encodeResponse($user);
            return response()->json($user,200);
        } catch (PatientUserException $e) {
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
            $removed = $this->pUserRepo->remove($id);
            if ($removed) {
                $user = $this->encodeResponse(json_encode(['exitoso'=>true]));
                return response()->json($user,200);
            }
        } catch (PatientUserException $e) {
            return response()->json($e->getMessage(),$e->getCode());
        }
    }


    /**
        get parents Mother or Father 
    **/
    public function getParent(Request $request)
    {
        try {
            if ($request->has('parent')) {
                $parentType = $request->get('parent');
                $parents = $this->pUserRepo->getParents($parentType);
                return response()->json($parents,200);
            } else {
                throw new \Exception("Parámetro inválido", 500);
                
            }
        } catch (\Exception $e) {
            return response()->json($e->getMessage(),$e->getCode());
        }
    }

    public function import()
    {
        $this->pUserRepo->importData();
    }
}