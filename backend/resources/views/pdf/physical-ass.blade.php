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
					<td><h2 class="subtitle">EVALUACIÓN FÍSICA-ORTOPÉDICA</h2></td>
				</tr>
			</tbody>
		</table>
		<div class="content-form">
			<table class="table-bordered mt">
				<tbody>
					<tr>
						<td colspan="3" class="t-bb-bordered"><b>Nombre de Usuario:</b> <span class="data-field">{{$physicalAss->patientUser->person->last_name}} {{$physicalAss->patientUser->person->name}}</span>  </td>
					</tr>
					<tr>
						<td class="t-bb-bordered t-br-bordered"><b>Fecha de Nacimiento:</b> <span class="data-field">{{$physicalAss->patientUser->person->date_birth}}</span></td>
						<td colspan="2" class="t-bb-bordered"><b>Diagnóstico:</b> {{ $physicalAss->patientUser->pathology ?  $physicalAss->patientUser->pathology->name : 'NO TIENE'  }} </td>
					</tr>
					<tr>
						<td class="t-bb-bordered t-br-bordered"><b>Fecha de Evaluación:</b> <span class="data-field">{{$physicalAss->date_eval}}</span></td>
						<td class="t-bb-bordered t-br-bordered"><b>Hora de Evaluación:</b><span class="data-field">
							{{date_format(date_create($physicalAss->created_at),'H:m')}}
					</span></td>
						<td class="t-bb-bordered t-br-bordered"><b>Profesional Responsable:</b> <span class="data-field">{{$physicalAss->creator->person->name}} {{$physicalAss->creator->person->last_name}}</span></td>
					</tr>
					<tr>
						<td colspan="3" class="t-bb-bordered"><b>Padre/Madre/Tutor del niño/niña:</b><span class="data-field"> {{$physicalAss->patientUser->representant ? $physicalAss->patientUser->representant->last_name .' ' .$physicalAss->patientUser->representant->name : 'NO TIENE REPRESENTANTE' }}</span></td>
					</tr>
				</tbody>
			</table>

			<table class="mt-2">
				<tr>
					<td><b>Postura:</b></td>
					<td><b>Sedente:</b> <input type="checkbox" name="" id="" @if(isset($physicalAss->position['session']) && $physicalAss->position['session'] == '1')  checked @endif> </td>
					<td><b>Bipedestación:</b> <input type="checkbox" name="" id="" @if(isset($physicalAss->position['bipedestation']) && $physicalAss->position['bipedestation'] == '1')  checked @endif> </td>
					<td><b>Decúbito:</b> <input type="checkbox" name="" id="" @if(isset($physicalAss->position['decubito']) && $physicalAss->position['decubito'] == '1')  checked @endif> </td>
				</tr>
				<tr>
					<td colspan="4" class="t-bb-bordered"><b>Otros:</b> <span class="data-field">{{$physicalAss->position['others']}}</span></td>
				</tr>
			</table>

			<table class="mt-4">
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
			</table>
		</div>
	</div>
@endsection
