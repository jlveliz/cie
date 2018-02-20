<?php

namespace Cie\Models;

// use Illuminate\Database\Eloquent\Model;

class Permission extends BaseModel
{
    protected $table = "permission";

    protected $with = ['module','type','parent'];

    protected $primaryKey = "id";

    protected $no_uppercase = [
        'code',
        'resource',
        'fav_icon'
    ];

    protected $casts = [
        'module_id' => 'int',
        'parent_id' => 'int',
        'type_id' => 'int',
    ];

    protected $fillable = [
    	'name',
    	'module_id',
    	'parent_id',
    	'type_id',
    	'resource',
    	'description',
        'fav_icon',
        'order',
        'code'
    ];


    public function module()
    {
        return $this->belongsTo('Cie\Models\Module','module_id');
    }

    public function parent()
    {
        return $this->belongsTo('Cie\Models\Permission','parent_id');
    }

    public function type()
    {
    	return $this->belongsTo('Cie\Models\PermissionType','type_id');
    }

    public function children()
    {
       return $this->hasMany('Cie\Models\Permission','parent_id','id');
    }

    public function roles()
    {
        return $this->belongsToMany('Cie\Models\Role','role_id');
    }

    public static function boot()
    {
        $istance = new Static;
        parent::boot();
        static::saving(function($permission) use($istance){
            $permission->code =  str_replace(" ", '_', strtolower($istance->removeAccent($permission->name)));
        });

        static::updating(function($permission) use($istance) {
            $permission->code =  str_replace(" ", '_', strtolower($istance->removeAccent($permission->name)));
        });
    }

    private function removeAccent($string){
        //Codificamos la cadena en formato utf8 en caso de que nos de errores
        $string = utf8_encode($string);
 
        //Ahora reemplazamos las letras
        $string = str_replace(
            array('á', 'à', 'ä', 'â', 'ª', 'Á', 'À', 'Â', 'Ä'),
            array('a', 'a', 'a', 'a', 'a', 'A', 'A', 'A', 'A'),
            $string
        );
     
        $string = str_replace(
            array('é', 'è', 'ë', 'ê', 'É', 'È', 'Ê', 'Ë'),
            array('e', 'e', 'e', 'e', 'E', 'E', 'E', 'E'),
            $string );
     
        $string = str_replace(
            array('í', 'ì', 'ï', 'î', 'Í', 'Ì', 'Ï', 'Î'),
            array('i', 'i', 'i', 'i', 'I', 'I', 'I', 'I'),
            $string );
     
        $string = str_replace(
            array('ó', 'ò', 'ö', 'ô', 'Ó', 'Ò', 'Ö', 'Ô'),
            array('o', 'o', 'o', 'o', 'O', 'O', 'O', 'O'),
            $string );
     
        $string = str_replace(
            array('ú', 'ù', 'ü', 'û', 'Ú', 'Ù', 'Û', 'Ü'),
            array('u', 'u', 'u', 'u', 'U', 'U', 'U', 'U'),
            $string );
     
        $string = str_replace(
            array('ñ', 'Ñ', 'ç', 'Ç'),
            array('n', 'N', 'c', 'C'),
            $string
        );
     
        return $string;
    }
}
