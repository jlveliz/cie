<?php

namespace Cie\Http\Controllers\Auth;

use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Cie\Http\Validators\AuthenticateValidator;
use Tymon\JWTAuth\Exceptions\JWTException;
use Cie\Exceptions\AuthenticateException;
use Cie\Http\Controllers\Controller;
use Illuminate\Auth\Events\Login;
use Illuminate\Http\Request;
use JWTAuth;
use Auth;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */


    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct() {
        $this->middleware('jwt.auth', ['except' => ['login']]);
    }


    public function login(AuthenticateValidator $validator, Request $request) {
        try {

            if ($validator->make($request)) {
                if ($token =  JWTAuth::attempt($request->all())) {
                    $user = Auth::user();
                    event(new Login($user,false));
                }
            }
            // verify the credentials and create a token for the user
            if (!$token) {
                return response()->json(['message' => 'Correo o clave incorrectas'], 401);
            } 
        } catch (AuthenticateException $e) {
            // something went wrong
            return response()->json(['message' => $e->getMessage()], $e->getCode());
        }catch (JWTException $e) {
            // something went wrong
            return response()->json(['message' => 'could_not_create_token'], 500);
        } 
        return response()->json(compact('token'),200);
    }



    public function verify() {
        try {
 
            if (!$user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['user_not_found'], 404);
            } 
 
        } catch (TokenExpiredException $e) {
            
            return response()->json(['token_expired'], $e->getCode());
 
        } catch (TokenInvalidException $e) {
 
            return response()->json(['token_invalid'], $e->getCode());
 
        } catch (JWTException $e) {
 
            return response()->json(['token_absent'], $e->getCode());
 
        }

        // the token is valid and we have found the user via the sub claim
        return response()->json($user);
    }


     /**
     * refresh token every time
     */
    public function refresh()
    {
        $token = JWTAuth::getToken();

        if(!$token){
            throw new BadRequestHtttpException('Token not provided');
        }

        try{
            $token = JWTAuth::refresh($token);
           
        }catch(TokenInvalidException $e){
            throw new AccessDeniedHttpException('The token is invalid');
        }

        return response()->json(compact('token'));
    }
}
