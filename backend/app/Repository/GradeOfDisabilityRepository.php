<?php
namespace Cie\Repository;

use Cie\RepositoryInterface\GradeOfDisabilityRepositoryInterface;
use Cie\Exceptions\GradeOfDisabilityException;
use Cie\Models\GradeOfDisability;

/**
* 
*/
class GradeOfDisabilityRepository implements GradeOfDisabilityRepositoryInterface
{
	
	
	public function enum($params = null)
	{
		$grades = GradeOfDisability::all();
		

		if (!$grades) {
			throw new GradeOfDisabilityException(['title'=>'No se han encontrado el listado de  Grados de discapacidad','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");
		}
		return $grades;
	}



	public function find($field)
	{
		if (is_array($field)) {

			if (array_key_exists('name', $field)) { 
				$grade = GradeOfDisability::where('name',$field['name'])->first();	
			} else {

				throw new GradeOfDisabilityException(['title'=>'No se puede buscar el grado de discapacidad','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");	
			}

		} elseif (is_string($field) || is_int($field)) {
			$grade = GradeOfDisability::where('id',$field)->first();
		} else {
			throw new GradeOfDisabilityException(['title'=>'No se puede buscar el grado de discapacidad','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");	
		}

		if (!$grade) throw new GradeOfDisabilityException(['title'=>'No se puede buscar el grado de discapacidad','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"404");	
		
		return $grade;

	}

	//TODO
	public function save($data)
	{
		$grade = new GradeOfDisability();
		$grade->fill($data);
		if ($grade->save()) {
			$key = $grade->getKey();
			return  $this->find($key);
		} else {
			throw new GradeOfDisabilityException(['title'=>'Ha ocurrido un error al guardar el grado de discapacidad '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
		}		
	}

	public function edit($id,$data)
	{
		$grade = GradeOfDisability::find($id);
		if ($grade) {
			$grade->fill($data);
			if($grade->update()){
				$key = $grade->getKey();
				return $this->find($key);
			}
		} else {
			throw new GradeOfDisabilityException(['title'=>'Ha ocurrido un error al actualizar el grado de discapacidad '.$data['name'].'','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
		}


	}

	public function remove($id)
	{
		if ($grade = $this->find($id)) {
			$grade->delete();
			return true;
		}
		throw new GradeOfDisabilityException(['title'=>'Ha ocurrido un error al eliminar el grado de discapacidad ','detail'=>'Intente nuevamente o comuniquese con el administrador','level'=>'error'],"500");
	}
}