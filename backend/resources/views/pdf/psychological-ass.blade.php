@extends('pdf.layout')

@section('css')
<style>
	body{
		font-size: .95rem!important	
	}
</style>
@endsection

@section('content')
	<div id="header">
		<img src="{{ asset('public/images/reports/header_report.png') }}" alt="Gobierno Provincial del Guayas" title="Gobierno Provincial del Guayas" height="100%" width="100%">
	</div>
	<!-- /header -->

	<!-- /footer -->
	<div id="footer">
		<img src="{{ asset('public/images/reports/footer_report.png') }}" alt="Gobierno Provincial del Guayas" title="Gobierno Provincial del Guayas" height="100%" width="100%">
	</div>

	{{-- content --}}
	<div class="content">
		<table>
			<tbody>
				<tr>
					<td><h1 class="title">DIRECCIÓN PROVINCIAL DEL CENTRO DE EQUINOTERAPIA</h1></td>
				</tr>
			</tbody>
		</table>
		<table>
			<tbody>
				<tr>
					<td><h2 class="subtitle">ENTREVISTA PSICOLÓGICA</h2></td>
				</tr>
			</tbody>
		</table>
		<div class="content-form">
			 <table class="table-bordered mt">
				
					<tr>
						<td class="text-center t-bb-bordered" colspan="2"><b>DATOS GENERALES</b></td>
					</tr>
					<tr>
						<td class="t-bb-bordered"><b>Fecha de Evaluación:</b> {{date_format(date_create($psychoAss->date_eval),'Y-m-d')}} </td>
						<td class="t-bb-bordered"><b>Nombre:</b> {{$psychoAss->patientUser? $psychoAss->patientUser->last_name : ''}} {{ $psychoAss->patientUser? $psychoAss->patientUser->name : ''}} </td>
					</tr>
					<tr>
						<td class="t-bb-bordered"><b>Como le llaman en casa:</b> {{$psychoAss->call_user_in_home}} </td>
						<td class="t-bb-bordered"><b>Edad:</b> {{$psychoAss->patientUser->person->age}} </td>
					</tr>
					<tr>
						<td class="t-bb-bordered"><b>Fecha de Nacimiento:</b> {{date_format(date_create($psychoAss->patientUser->person->date_birth),'Y-m-d')}} </td>
						<td class="t-bb-bordered"><b>Género:</b> {{$psychoAss->patientUser && $psychoAss->patientUser->person ? $psychoAss->patientUser->person->genre == 'M' ? 'Masculino' : 'Femenino' : ''}} </td>
					</tr>
					<tr>
						<td class="t-bb-bordered"><b>Escolaridad:</b> {{$psychoAss->patientUser ? $psychoAss->patientUser->getHasSchoolingType(): ''}} </td>
						<td class="t-bb-bordered"><b>Dirección Domiciliaria:</b> {{$psychoAss->patientUser && $psychoAss->patientUser->person ? $psychoAss->patientUser->person->address: ''}} </td>
					</tr>
					<tr>
						<td class="t-bb-bordered" colspan="2">
							<b>Diagnóstico <small>(Si ha sido otorgado por alguna instucional)</small>: </b> 
							{{!$psychoAss->patientUser->hasDiagnostic() ? 'No Tiene' :  $psychoAss->patientUser->diagnostic->name }}
						</td>
					</tr>
				
			</table>

			<table class="mt-2">
				<tr>
					<td class="text-center t-bb-bordered" colspan="2"><b>ANTECEDENTES FAMILIARES</b></td>
				</tr>
				@if ($psychoAss->patientUser && $psychoAss->patientUser->father)
					<tr>
						<td><b>Nombre del Padre:</b> {{$psychoAss->patientUser->father->last_name .' '.$psychoAss->patientUser->father->name}}</td>
						<td><b>Edad:</b> {{$psychoAss->patientUser->father->age}}</td>
					</tr>
					<tr>	
						<td><b>Estado Civil:</b> {{$psychoAss->getStatusCivilFather()}}  </td>
						<td><b>Escolaridad:</b> {{$psychoAss->father_schooling}} </td>
					</tr>
				@else
					<tr>
						<td colspan="2">No  tiene padre</td>
					</tr>
				@endif

				@if ($psychoAss->patientUser && $psychoAss->patientUser->mother)
					<tr>
						<td><b>Nombre del Padre:</b> {{$psychoAss->mother_name}}</td>
						<td><b>Edad:</b> {{$psychoAss->mother_age}}</td>
					</tr>
					<tr>	
						<td><b>Estado Civil:</b> {{$psychoAss->getStatusCivilMother()}}  </td>
						<td><b>Escolaridad:</b> {{$psychoAss->father_schooling}} </td>
					</tr>
				@else
					<tr>
						<td colspan="2">No  tiene Madre</td>
					</tr>
				@endif
			</table>

			{{--<table class="mt-4">
				<tr>
					<td  colspan="2"><b>Tono Muscular General:</b></td>
					<td><b>Hipotónico:</b> <input type="checkbox" name="" id="" @if(isset($physicalAss->muscular_tone_general['hipotonic']) && $physicalAss->muscular_tone_general['hipotonic'] == '1')  checked @endif> </td>
					<td><b>Hipertónico:</b> <input type="checkbox" name="" id="" @if(isset($physicalAss->muscular_tone_general['hipertonic']) && $physicalAss->muscular_tone_general['hipertonic'] == '1')  checked @endif> </td>
				</tr>
				<tr>
					<td colspan="4" class="t-bb-bordered"><b>Otros:</b> <span class="data-field">{{$physicalAss->muscular_tone_general['others']}}</span></td>
				</tr>
			</table>
		

			<div style="border:1px solid #0000">
				<table class="table-bordered mt-2">
					<tr>
						<td><b>CONTROL CEFÀLICO</b></td>
						<td>Si <input type="radio" name="" id="" @if($physicalAss->cephalic_control == '1') checked @endif></td>
						<td>No <input type="radio" name="" id="" @if($physicalAss->cephalic_control == '0') checked @endif></td>
					</tr>
					<tr>
						<td rowspan="4"><b>Columna: </b></td>
						<td rowspan="1">NORMAL <input type="checkbox" name="" id="" @if(isset($physicalAss->column['normal']) && $physicalAss->column['normal'] == '1') checked @endif> </td>
						<td></td>
					</tr>
					<tr>
						<td rowspan="1">ESCOLIOSIS <input type="checkbox" name="" id="" @if(isset($physicalAss->column['escoliosis']) && $physicalAss->column['escoliosis'] == '1') checked="" @endif></td>
						<td></td>
					</tr>
					
					<tr>
						<td rowspan="1">ESCOLIOSIS <input type="checkbox" name="" id="" @if(isset($physicalAss->column['escoliosis']) && $physicalAss->column['escoliosis'] == '1') checked="" @endif></td>
						<td></td>
					</tr>
					<tr>
						<td rowspan="1">LORDOSIS <input type="checkbox" name="" id="" @if(isset( $physicalAss->column['lordosis']) && $physicalAss->column['lordosis'] == '1') checked="" @endif></td>
						<td></td>
					</tr>
					<tr>
						<td rowspan="1"><b>TRONCO</b></td>
						<td rowspan="1">XIFOSIS <input type="checkbox" name="" id="" @if(isset($physicalAss->column['xifosis']) &&  $physicalAss->column['xifosis'] == '1') checked="" @endif></td>
						<td></td>
					</tr>
					<tr>
						<td rowspan="2">
							<b>TONO MUSCULAR:</b>
						</td>
						<td rowspan="1">HIPOTÒNICO <input type="checkbox" name="" id="" @if (isset($physicalAss->muscular_tone['hipotonic']) && $physicalAss->muscular_tone['hipotonic'] == 1) checked @endif></td>
						<td rowspan="1">NORMAL <input type="checkbox" name="" id="" @if (isset($physicalAss->muscular_tone['normal']) &&  $physicalAss->muscular_tone['normal'] == 1) checked @endif></td>
					</tr>
					<tr>
						<td rowspan="1" colspan="2">HIPERTÒNICO <input type="checkbox" name="" id="" @if (isset($physicalAss->muscular_tone['hipertonic']) && $physicalAss->muscular_tone['hipertonic'] == 1) checked @endif></td>
					</tr>
				</table>
			</div>

			<table class="mt-2">
				<tr>
					<td class="t-bb-bordered"><b>Miembros Superiores:</b></td>
				</tr>
				<tr>
					<td class="t-bb-bordered"><b>Miembros Inferiores:</b></td>
				</tr>
				<tr>
					<td class="t-bb-bordered"><b>Marcha:</b></td>
				</tr>
				<tr>
					<td class="t-bb-bordered"><b>Observaciones:</b></td>
				</tr>
			</table>

			<table class="mt-4">
				<tr><td class="text-center">_______________________________ <br> <b class="d-block ">TERAPEUTA</b> </td><td></td>
				<td></td></tr>
			</table> --}}
		</div>
	</div>
@endsection
