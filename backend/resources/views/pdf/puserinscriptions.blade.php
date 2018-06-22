@extends('pdf.layout')
@section('content')

<div id="header">
	<img src="{{ asset('public/images/reports/header_report.png') }}" alt="Gobierno Provincial del Guayas" title="Gobierno Provincial del Guayas" height="100%" width="100%">
</div>
<!-- /header -->

<!-- /footer -->
<div id="footer">
	<img src="{{ asset('public/images/reports/footer_report.png') }}" alt="Gobierno Provincial del Guayas" title="Gobierno Provincial del Guayas" height="100%" width="100%">
</div>

<!-- /content -->
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
				<td><h2 class="subtitle">FICHA DE INSCRIPCIÓN</h2></td>
			</tr>
		</tbody>
	</table>
	<div class="content-form">
		{{-- content --}}
		<table>
			<tbody>
				<tr>
					<td class="section" colspan="3">DATOS DEL USUARIO</td>
				</tr>
			</tbody>
		</table>
		<br>
		<table class="table-section">
			<tbody>
				<tr>
					<td class="header-section" colspan="3">Datos Personales</td>
				</tr>
				<tr>
					<td colspan="3"><b class="field">Nombres y Apellidos:</b> <span class="data-field"> {{$pUser->last_name}} {{$pUser->name}} </span></td>
				</tr>
				<tr>
					<td colspan="2"> <b class="field">Cédula de Identidad:</b> <span class="data-field"> {{$pUser->num_identification ?  $pUser->num_identification : 'N/A'}} </span> </td>
					<td colspan="1"> <b class="field">Fecha de Nacimiento</b> <span class="data-field">{{$pUser->date_birth ? $pUser->date_birth : 'N/A'}}</span> </td>
				</tr>
				<tr>
					<td colspan="1"> <b class="field">Edad:</b> <span class="data-field"> {{$pUser->age ?  $pUser->age .' Años' : 'N/A'}} </span> </td>
					<td colspan="1"> <b class="field">Sexo:</b> <span class="data-field"> {{$pUser->genre == 'M' ?  'Masculino' : 'Femenino'}} </span> </td>
					<td colspan="1"> <b class="field">Carnet No.:</b> <span class="data-field"> {{$pUser->conadis_id ?  $pUser->conadis_id : 'N/A'}} </span> </td>
				</tr>
				<tr>
					<td colspan="3"> <b class="field">Domicilio:</b> <span class="data-field"> {{$pUser->address ?  $pUser->address : 'N/A'}} </span></td>
				</tr>
				<tr>
					<td colspan="1"> <b class="field">Provincia:</b> <span class="data-field"> {{$pUser->province ?  $pUser->province->name : 'N/A'}} </span> </td>
					<td colspan="1"> <b class="field">Cantón:</b> <span class="data-field"> {{$pUser->city ?  $pUser->city->name : 'N/A'}} </span> </td>
					<td colspan="1"> <b class="field">Parroquia:</b> <span class="data-field"> {{$pUser->parish ?  $pUser->parish->name : 'N/A'}} </span> </td>
				</tr>
			</tbody>
		</table>

		{{-- DISCAPACIDAD --}}
		<table class="table-section">
			<tbody>
				<tr>
					<td class="header-section" colspan="5">Discapacidad</td>
				</tr>
				<tr>
					<td colspan="5" align="center"> <b class="field">Tipo de discapacidad</b></td>
				</tr>
				<tr>
					<td> <b class="field">Física:</b> <span class="data-field">{{$pUser->physical_disability}}%</span> </td>
					<td> <b class="field">Intelectual:</b> <span class="data-field">{{$pUser->intellectual_disability}}%</span></td>
					<td> <b class="field">Visual:</b> <span class="data-field">{{$pUser->visual_disability}}%</span></td>
					<td> <b class="field">Auditiva:</b> <span class="data-field">{{$pUser->hearing_disability}}%</span></td>
					<td> <b class="field">Psicosocial:</b> <span class="data-field">{{$pUser->psychosocial_disability}}%</span></td>
				</tr>
				<tr>
					<td colspan="1"> <b class="field">Grado de Discapacidad:</b> <span class="data-field">{{$pUser->grade_of_disability ? $pUser->getGradeDisability() : 'N/A' }} </span> </td>
					<td colspan="1"> <b class="field">Tiene Diagnóstico?:</b> <span class="data-field">{{$pUser->has_diagnostic == 1 ? 'Si' : 'No' }} </span> </td>
					<td colspan="3"> <b class="field">Diagnóstico:</b> <span class="data-field">{{$pUser->diagnostic ? $pUser->diagnostic->name : 'N/A' }} </span> </td>
				</tr>
				<tr>
					<td colspan="5"> <b class="field">Otros Diagnósticos:</b> <span class="data-field">{{$pUser->other_diagnostic ? $pUser->other_diagnostic : 'N/A' }} </span> </td>
				</tr>
				<tr>
					<td colspan="5"> <b class="field">Entidad que emite el Diagnóstico:</b> <span class="data-field">{{$pUser->entity_send_diagnostic ? $pUser->entity_send_diagnostic : 'N/A' }} </span> </td>
				</tr>
				<tr>
					<td colspan="2"> <b class="field">Asiste a otros centros terapéuticos:</b> <span class="data-field">{{$pUser->assist_other_therapeutic_center == 1 ? 'Si' : 'No' }} </span> </td>
					<td colspan="3"> <b class="field">Nombre de la Institución:</b> <span class="data-field">{{$pUser->therapeutic_center_name ? $pUser->therapeutic_center_name : 'N/A' }} </span> </td>
				</tr>
			</tbody>
		</table>


		{{-- ASISTENCIA MÉDICA --}}
		<table class="table-section">
			<tbody>
				<tr>
					<td class="header-section" colspan="5">Asistencia Médica</td>
				</tr>
				<tr>
					<td colspan="2"> <b class="field">Tiene algún tipo de seguro:</b> <span class="data-field">{{$pUser->has_insurance ? $pUser->getHasTypeInsurance() : 'N/A' }} </span> </td>
					<td colspan="3"> <b class="field">Recibe atención Médica en:</b> <span class="data-field">{{$pUser->receives_medical_attention ? $pUser->getNameMedicalAttention() : 'N/A' }} </span> </td>
				</tr>
				<tr>
					<td colspan="5"> <b class="field">Nombre de la Institución:</b> <span class="data-field">{{$pUser->name_medical_attention ? $pUser->name_medical_attention : 'N/A' }} </span> </td>
				</tr>
			</tbody>
		</table>

		{{-- EDUCACIÓN FORMAL --}}
		<table class="table-section">
			<tbody>
				<tr>
					<td class="header-section" colspan="4">Educación Formal</td>
				</tr>
				<tr>
					<td colspan="1"> <b class="field">Escolarización: </b> <span class="data-field">{{$pUser->schooling ? $pUser->getHasSchooling() : 'N/A' }} </span> </td>
					<td colspan="3"> <b class="field">Tipo Escolarización:</b> <span class="data-field">{{$pUser->schooling_type ? $pUser->getHasSchoolingType() : 'N/A' }} </span> </td>
				</tr>
				<tr>
					<td colspan="4"> <b class="field">Nombre de la Institución:</b> <span class="data-field">{{$pUser->schooling_name ? $pUser->schooling_name : 'N/A' }} </span> </td>
				</tr>
			</tbody>
		</table>
	</div>
</div>

{{-- page 2 --}}
<div class="page-break"></div>

<div id="header">
	<img src="{{ asset('public/images/reports/header_report.png') }}" alt="Gobierno Provincial del Guayas" title="Gobierno Provincial del Guayas" height="100%" width="100%">
</div>
<!-- /header -->

<!-- /footer -->
<div id="footer">
	<img src="{{ asset('public/images/reports/footer_report.png') }}" alt="Gobierno Provincial del Guayas" title="Gobierno Provincial del Guayas" height="100%" width="100%">
</div>

<div class="content">
	<div class="content-form">
		{{-- content --}}
		<table>
			<tbody>
				<tr>
					<td class="section" colspan="3">DATOS DE FAMILIARES</td>
				</tr>
			</tbody>
		</table>
		<br>
		{{-- DATOS DEL PADRE --}}
		<table class="table-section">
			<tbody>
				<tr>
					<td class="header-section" colspan="4">Datos del Padre</td>
				</tr>
					@if ($pUser->has_father)
					<tr>
						<td colspan="2">
							<b class="field">Nombre del Padre:</b> <span class="data-field">{{$pUser->father->last_name }}  {{$pUser->father->name}}</span>
						</td>
						<td colspan="2">
							<b class="field">C.I:</b> <span class="data-field">{{$pUser->father->num_identification }}</span>
						</td>
					</tr>
					<tr>
						<td><b class="field">Fecha de Nacimiento:</b> <span class="data-field">{{$pUser->father->date_birth }}</span> </td>
						<td><b class="field">Edad:</b> <span class="data-field">{{$pUser->father->age}}</span> </td>
						<td><b class="field">Teléfono:</b> <span class="data-field">{{$pUser->father->phone}}</span> </td>
						<td><b class="field">Celular:</b> <span class="data-field">{{$pUser->father->mobile}}</span> </td>
					</tr>
					<tr>
						<td colspan="4">
							<b class="field">Actividad en la que labora:</b>
							<span>{{$pUser->father->activity}} </span>
						</td>
					</tr>
					@else 
					<tr>
						<td colspan="4" align="center"><b>No Tiene</b></td>
					</tr>
					@endif
			</tbody>
		</table>

		{{-- DATOS DE LA MADRE --}}
		<table class="table-section">
			<tbody>
				<tr>
					<td class="header-section" colspan="4">Datos de la Madre</td>
				</tr>
					@if ($pUser->has_mother)
					<tr>
						<td colspan="2">
							<b class="field">Nombre de la Madre:</b> <span class="data-field">{{$pUser->mother->last_name }}  {{$pUser->mother->name}}</span>
						</td>
						<td colspan="2">
							<b class="field">C.I:</b> <span class="data-field">{{$pUser->mother->num_identification }}</span>
						</td>
					</tr>
					<tr>
						<td><b class="field">Fecha de Nacimiento:</b> <span class="data-field">{{$pUser->mother->date_birth }}</span> </td>
						<td><b class="field">Edad:</b> <span class="data-field">{{$pUser->mother->age}}</span> </td>
						<td><b class="field">Teléfono:</b> <span class="data-field">{{$pUser->mother->phone}}</span> </td>
						<td><b class="field">Celular:</b> <span class="data-field">{{$pUser->mother->mobile}}</span> </td>
					</tr>
					<tr>
						<td colspan="4">
							<b class="field">Actividad en la que labora:</b>
							<span>{{$pUser->mother->activity}} </span>
						</td>
					</tr>
					@else 
					<tr>
						<td colspan="4" align="center"><b>No Tiene</b></td>
					</tr>
					@endif
			</tbody>
		</table>

		{{-- DATOS DEL REPRESENTANTE --}}
		<table class="table-section">
			<tbody>
				<tr>
					<td class="header-section" colspan="4">Datos del Representante</td>
				</tr>
					@if ($pUser->representant_id)
					<tr>
						<td colspan="2">
							<b class="field">Nombre del Representante:</b> <span class="data-field">{{$pUser->representant->last_name }}  {{$pUser->representant->name}}</span>
						</td>
						<td colspan="2">
							<b class="field">C.I:</b> <span class="data-field">{{$pUser->representant->num_identification }}</span>
						</td>
					</tr>
					<tr>
						<td><b class="field">Fecha de Nacimiento:</b> <span class="data-field">{{$pUser->representant->date_birth }}</span> </td>
						<td><b class="field">Edad:</b> <span class="data-field">{{$pUser->representant->age}}</span> </td>
						<td><b class="field">Teléfono:</b> <span class="data-field">{{$pUser->representant->phone}}</span> </td>
						<td><b class="field">Celular:</b> <span class="data-field">{{$pUser->representant->mobile}}</span> </td>
					</tr>
					<tr>
						<td colspan="4">
							<b class="field">Actividad en la que labora:</b>
							<span>{{$pUser->representant->activity}} </span>
						</td>
					</tr>
					<tr>
						<td colspan="2">
							<b class="field">Correo Electrónico:</b>
							<span>{{$pUser->representant->email}} </span>
						</td>
						<td colspan="2">
							<b class="field">Redes Sociales que Maneja:</b>
							<span>
								{{$pUser->representant->has_facebook ? ' Facebook ' : ''}} 
								{{$pUser->representant->has_twitter ? ' Twitter ' : ''}} 
								{{$pUser->representant->has_instagram ? ' Instagram ' : ''}} 
							</span>
						</td>
					</tr>
					@else 
					<tr>
						<td colspan="4" align="center"><b>No Tiene</b></td>
					</tr>
					@endif
			</tbody>
		</table>

		<table class="table-section">
			<tbody>
				<tr>
					<td class="header-section" colspan="4">Convivencia con el Usuario</td>
				</tr>
			</tbody>
		</table>
		
		{{-- OBSERVACION --}}
		<table>
			<tbody>
				<tr>
					<td>
						<b class="field">Estado Civil:</b> <span class="data-field">{{$pUser->parent_status_civil }}</span>
					</td>
					<td>
						<b class="field">El Usuario vive con: </b> <span class="data-field">{{$pUser->user_live_with}}</span>
					</td>
				</tr>
				<tr>
					<td colspan="2"><b class="field">Observación:</b> <span class="data-field">{{$pUser->observation}}</span></td>
				</tr>
			</tbody>
		</table>

		<br>
		<table class="table-signature">
			<tbody>
				<tr>
					<td><b class="field">Firma del Representante</b></td>
					<td></td>
				</tr>
				<tr>
					<td style="width: 50%"><b class="field">Fecha</b></td>

				</tr>
			</tbody>
		</table>
	</div>
</div>



{{-- page 3 --}}
<div class="page-break"></div>

<div id="header">
	<img src="{{ asset('public/images/reports/header_report.png') }}" alt="Gobierno Provincial del Guayas" title="Gobierno Provincial del Guayas" height="100%" width="100%">
</div>
<!-- /header -->

<!-- /footer -->
<div id="footer">
	<img src="{{ asset('public/images/reports/footer_report.png') }}" alt="Gobierno Provincial del Guayas" title="Gobierno Provincial del Guayas" height="100%" width="100%">
</div>

<div class="content">
	<div class="content-form">
		<h1 class="title">DIRECCIÓN PROVINCIAL DEL CENTRO DE EQUINOTERAPIA</h1>
		<h2 class="subtitle">CARTA DE COMPROMISO</h2>
		<br><br>
		<p>Yo, <span class="field">{{$pUser->representant ? $pUser->representant->last_name . ' ' .$pUser->representant->name : 'N/A'}}</span> Con CI <span class="field">{{$pUser->representant ? $pUser->representant->num_identification : 'N/A' }}</span> Certifico que mi representado/a <span class="field">{{$pUser->last_name}} {{$pUser->name}}</span> con CI <span class="field">{{$pUser->num_identification}}</span>, se encuentra bajo mi total responsabilidad en el <b class="field">Centro Integral de Equinoterapia</b> cuando asiste a sus respectivas terapias de rehabilitación y está siempre bajo mi supervisión y cuidado.</p>

		<p>Además dejo constancia que he sido informado de lo siguiente:</p>
		<ul>
			<li>- El usuario no podrá tener 3 faltas consecutivas injustificadas, porque será retirado/a  del servicio de Terapias.</li>
			<li>- Solo podrá tener 2 re-ingresos dentro de un mismo año, siempre y cuando haya justificado formalmente las inasistencias, y estará sujeto a disponibilidad de cupo.</li>
			<li>- Se mantendrá permisos de asistencia solo por 1 mes, previamente justificación formal con certificado. Después del mes de permiso deberá realizar el re-ingreso correspondiente.</li>
			<li>- Debe cumplir con los requisitos de inscripción, de lo contrario el usuario será suspendido del servicio de terapias.</li>
		</ul>
		<p>Teniendo conocimiento de esta información desligo de toda responsabilidad al Centro Integral de Equinoterapia del Gobierno Provincial del Guayas.</p>

		<br>
		<table class="table-signature">
			<tbody>
				<tr>
					<td><b class="field">Firma del Representante</b></td>
					<td></td>
				</tr>
				<tr>
					<td style="width: 50%"><b class="field">Fecha</b></td>
				</tr>
				<tr>
					<td style="width: 50%"><b class="field">Celular</b></td>
				</tr>
			</tbody>
		</table>
	</div>
</div>



{{-- page 4 --}}
<div class="page-break"></div>

<div id="header">
	<img src="{{ asset('public/images/reports/header_report.png') }}" alt="Gobierno Provincial del Guayas" title="Gobierno Provincial del Guayas" height="100%" width="100%">
</div>
<!-- /header -->

<!-- /footer -->
<div id="footer">
	<img src="{{ asset('public/images/reports/footer_report.png') }}" alt="Gobierno Provincial del Guayas" title="Gobierno Provincial del Guayas" height="100%" width="100%">
</div>

<div class="content">
	<div class="content-form">
		<h1 class="title">DIRECCIÓN PROVINCIAL DEL CENTRO DE EQUINOTERAPIA</h1>
		<h2 class="subtitle">CARTA DE AUTORIZACIÓN <br> DE USO DE IMAGEN</h2>
		<br><br>
		<p>Yo, <span class="field">{{$pUser->representant ? $pUser->representant->last_name . ' ' .$pUser->representant->name : 'N/A'}}</span> Ecuatoriano/a, Mayor de edad, domiciliado en <span class="field">{{$pUser->representant ? $pUser->address : 'N/A'}}</span> Identificado/a con número de CI. <span class="field">{{$pUser->representant ? $pUser->representant->num_identification : 'N/A'}}</span> de <span class="field">{{$pUser->representant ? $pUser->representant->age : 'N/A'}}</span> años de edad, autorizo la realización de tomas fotográficas y de video a mi hijo/a o representada/o <span class="field">{{$pUser->last_name}} {{$pUser->name}}</span>, para USO EN MEDIOS DE COMUNICACIÓN Y REDES SOCIALES DE LA PREFECTURA DEL GUAYAS, a difundirse a nivel nacional.</p>
		<p>Declaro conocer las condiciones que involucran el uso de las imágenes para los fines señalados.</p>

		<br>
		<table class="table-signature">
			<tbody>
				<tr>
					<td><b class="field">Firma del Representante</b></td>
					<td></td>
				</tr>
				<tr>
					<td style="width: 50%"><b class="field">Fecha</b></td>
				</tr>
				<tr>
					<td style="width: 50%"><b class="field">Celular</b></td>
				</tr>
			</tbody>
		</table>
	</div>
</div>
@endsection()