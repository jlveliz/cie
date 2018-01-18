<?php

namespace Cie\Providers;

use Illuminate\Support\ServiceProvider;
use Validator;

class ExtendValidatorServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {
        ///if a ci valid
        Validator::extend('is_valid_id',function($attribute, $value, $parameters, $validator){
            //Preguntamos si la $value consta de 10 digitos
            if (strlen($value) == 10) {
                //Obtenemos el digito de la region que sonlos dos primeros digitos
                $regionId = substr($value,0, 2);
                //Pregunto si la region existe ecuador se divide en 24 regiones
                if ($regionId >= 1 && $regionId <= 24) {
                    // Extraigo el ultimo digito
                    $lastDigit = substr($value,9, 1);
                    // dd($lastDigit);
                    //Agrupo todos los pair y los sumo
                    $pair = substr($value,1, 1) + substr($value,3, 1) + substr($value,5, 1) + substr($value,7, 1);
                    
                    //Agrupo los odd, los multiplico por un factor de 2, si la resultante es > que 9 le restamos el 9 a la resultante
                    $numOne = substr($value,0, 1);

                    $numOne = ($numOne * 2);
                    if ($numOne > 9) { $numOne = ($numOne - 9); }
                    $numThree = substr($value,2, 1);
                    $numThree = ($numThree * 2);
                    if ($numThree > 9) { $numThree = ($numThree - 9); }
                    $numFive = substr($value,4, 1);
                    $numFive = ($numFive * 2);
                    if ($numFive > 9) { $numFive = ($numFive - 9); }
                    $numSeven = substr($value,6, 1);
                    $numSeven = ($numSeven * 2);
                    if ($numSeven > 9) { $numSeven = ($numSeven - 9); }
                    $numNine = substr($value,8, 1);
                    $numNine = ($numNine * 2);
                    if ($numNine > 9) { $numNine = ($numNine - 9); }
                    $odd = $numOne + $numThree + $numFive + $numSeven + $numNine;
                    //Suma total
                    $sumTotal = ($pair + $odd);
                    //extraemos el primero digito
                    $firstDigitSum = substr($sumTotal,0, 1);
                    //Obtenemos la $ten inmediata
                    $ten = (intval($firstDigitSum) + 1) * 10;
                    //Obtenemos la resta de la $ten inmediata - la $sumTotal esto nos da el digito validador
                    $validatorDigit = $ten - $sumTotal;

                    //Si el digito validador es = a 10 toma el valor de 0
                    if ($validatorDigit == 10)
                        $validatorDigit = 0;
                    
                   
                    //Validamos que el digito validador sea igual al de la $value
                    if ($validatorDigit == $lastDigit) {
                   
                        return true;
                    } else {
                        return false;
                    }

                } else {
                    // imprimimos en consola si la region no pertenece
                    return false;
                }
            } else {
                //imprimimos en consola si la $value tiene mas o menos de 10 digitos
                return false;
            }  
        });


        Validator::extend('number_between',function($attribute, $value, $parameters, $validator){
            
            if ($value >= $parameters[0] && $value <= $parameters[1]) {
                return true;
            }

            return false;

        });
    }

    /**
     * Register the application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
