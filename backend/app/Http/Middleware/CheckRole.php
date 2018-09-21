<?php

namespace Cie\Http\Middleware;

use Closure;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next, ...$roles)
    {
        if (!$request->user()->hasAnyRole($roles)) {
            return response('No puede acceder al recurso',401);
        }
        return $next($request);
    }
}
