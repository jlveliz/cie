<?php
namespace Cie\Models;

use Illuminate\Database\Eloquent\Model;
use Cie\Traits\ConvertToUpper;
/**
* 
*/
class BaseModel extends Model
{
	
    protected $perPage = 10;


	use ConvertToUpper;

	protected function removeAccent($string){

        return str_slug($string,'_');
        
    }
}