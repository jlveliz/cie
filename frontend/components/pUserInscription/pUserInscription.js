/**
 ** Inscriptions controller
 **/
define(['app', 'moment'], function(app, moment) {

    app.register.service('PUserInscriptionService', ['$q', 'layoutReportFactory', function($q, layoutReportFactory) {

        var _this = this;
        _this.messageFlag = {};

        _this.save = function(model) {

            var deferred = $q.defer();

            var successCallback = function(model) {
                deferred.resolve(model);
            }

            var failCallback = function(error) {
                deferred.reject(error);
            }

            if (model.id) {
                model.$update(model.id, successCallback, failCallback);
            } else {
                model.$save(successCallback, failCallback);
            }

            return deferred.promise;
        }

        _this.calculateAge = function(dateBirth) {
            if (!dateBirth) return "";
            var dateBirth = new Date(dateBirth);
            var currentDate = new Date();
            var age = currentDate.getFullYear() - dateBirth.getFullYear();
            var m = currentDate.getMonth() - dateBirth.getMonth();
            if (m < 0 || (m === 0 && currentDate.getDate() < dateBirth.getDate())) {
                age--;
            }
            return age;
        }

        _this.getPorcentages = function(dateBirth) {
            var porcentages = [];
            for (var i = 0; i <= 100; i++) {
                porcentages.push({
                    id: i,
                    value: i + ' %'
                })

            }
            return porcentages;

        }

        _this.gradeDisability = [
            { id: 'l', value: 'Leve' },
            { id: 'm', value: 'Moderado' },
            { id: 'g', value: 'Grave' }
        ];

        _this.yesOrNot = [
            { id: 1, value: 'Si' },
            { id: 0, value: 'No' }
        ];

        _this.insurances = [
            { id: 1, value: 'IESS' },
            { id: 2, value: 'Seguro Particular' },
            { id: 3, value: 'Otros' },
            { id: 4, value: 'No tiene Seguro' },
        ];

        _this.medicalAttentions = [
            { id: 1, value: 'Seguro Particular' },
            { id: 2, value: 'IESS' },
            { id: 3, value: 'MSP' },
            { id: 4, value: 'Fundaciones' },
            { id: 5, value: 'Dispensarios Médicos' },
            { id: 5, value: 'Junta de Beneficiencia' },
            { id: 6, value: 'Otros' }
        ];

        _this.scooling = [
            { id: 1, value: 'Regular' },
            { id: 2, value: 'Especial' }
        ];

        _this.scoolingType = [
            { id: 1, value: 'Particular' },
            { id: 2, value: 'Fiscal' },
            { id: 3, value: 'Fiscomisional' },
            { id: 4, value: 'Otros' }
        ];

        _this.statusCivil = [
            { id: 1, value: 'Casados' },
            { id: 2, value: 'Divorciados' },
            { id: 3, value: 'Separados' },
            { id: 4, value: 'Unión Libre' },
        ];

        _this.usrLiveWith = [
            { id: 1, value: 'Madre' },
            { id: 2, value: 'Padre' },
            { id: 3, value: 'Familiar' },
            { id: 4, value: 'Otro' },
        ];

        _this.representants = [
            { id: 1, value: 'Madre' },
            { id: 2, value: 'Padre' },
            { id: 3, value: 'Otro' },
        ];

        _this.statesForm = [
            { id: 1, value: 'Inactivo' },
            { id: 2, value: 'Activo' },
        ];

        _this.changeRepresentant = function(model, representant) {
            var familyType = representant.family;
            var representant = model.representant;
            switch (familyType) {
                case 1: //is mother
                    model.mother.is_representant = 1;
                    model.mother.has_facebook = representant.has_facebook;
                    model.mother.has_twitter = representant.has_twitter;
                    model.mother.has_instagram = representant.has_instagram;
                    model.father.is_representant = null;
                    model.father.has_facebook = null
                    model.father.has_twitter = null
                    model.father.has_instagram = null
                    break;
                case 2: //is father
                    model.mother.is_representant = null;
                    model.mother.has_facebook = null
                    model.mother.has_twitter = null
                    model.mother.has_instagram = null

                    model.father.is_representant = 1;
                    model.father.has_facebook = representant.has_facebook;
                    model.father.has_twitter = representant.has_twitter;
                    model.father.has_instagram = representant.has_instagram;
                    break;
                default:
                    //reset mother
                    model.mother.is_representant = null;
                    model.mother.has_facebook = null;
                    model.mother.has_twitter = null;
                    model.mother.has_instagram = null;
                    //reset father
                    model.father.is_representant = null;
                    model.father.has_facebook = null
                    model.father.has_twitter = null
                    model.father.has_instagram = null

            }

            model.representant = {};

            return model;
        }

        _this.getGradeDisability = function(gradeDisability) {
            var grade = null;
            angular.forEach(_this.gradeDisability, function(item) {
                if (item.id == gradeDisability) grade = item.value;
            });
            return grade;
        };

        _this.getHasTypeInsurance = function(typeInsurance) {
            var type = null;
            angular.forEach(_this.insurances, function(item) {
                if (item.id == typeInsurance) type = item.value;
            })
            return type;
        };

        _this.getNameMedicalAttention = function(medicalAt) {
            var medicalAte = null;
            angular.forEach(_this.medicalAttentions, function(item) {
                if (item.id == medicalAt) medicalAte = item.value;
            })
            return medicalAte;
        };

        _this.getHasSchooling = function(schoolingVal) {
            var schooling = null;
            angular.forEach(_this.scooling, function(item) {
                if (item.id == schoolingVal) schooling = item.value;
            })
            return schooling;
        };

        _this.getHasSchoolingType = function(schoolingTypeVal) {
            var schoolingType = null;
            angular.forEach(_this.scoolingType, function(item) {
                if (item.id == schoolingTypeVal) schoolingType = item.value;
            })
            return schoolingType;
        }



        _this.loadLetterEngagement = function(model) {
            return [
                //FICHA DE INSCRIPCION
                { text: 'FICHA DE INSCRIPCIÓN', style: 'header', margin: [0, 0, 0, 30] },
                { text: 'DATOS DEL USUARIO', bold: true, fontSize: 12, decoration: 'underline' },
                {
                    style: 'tableHeader',
                    table: {
                        widths: ['*'],
                        body: [
                            [{ text: 'Datos Personales', bold: true }]
                        ]
                    },
                    layout: { fillColor: '#CCCCCC', border: 0 }
                }, {
                    style: 'table',
                    table: {
                        widths: ['*'],
                        body: [
                            [{ text: [{ text: 'Nombres y Apellidos: ', bold: true }, model.last_name + ' ' + model.name] }],
                        ]
                    },
                    layout: 'noBorders'
                }, {
                    style: 'table',
                    table: {
                        widths: ['*', '*'],
                        body: [
                            [
                                { text: [{ text: 'Cedula de Identidad: ', bold: true }, model.num_identification] },
                                { text: [{ text: 'Fecha de Nacimiento: ', bold: true }, moment(model.date_birth).format('DD/MM/YYYY')] }
                            ]
                        ]
                    },
                    layout: 'noBorders'
                }, {
                    style: 'table',
                    table: {
                        widths: ['*', '*', '*'],
                        body: [
                            [
                                { text: [{ text: 'Edad: ', bold: true }, model.age] },
                                { text: [{ text: 'Sexo: ', bold: true }, model.genre == 'M' ? 'Masculino' : 'Femenino'] },
                                { text: [{ text: 'Carnet No: ', bold: true }, model.conadis_id] }
                            ]
                        ]
                    },
                    layout: 'noBorders'
                }, {
                    style: 'table',
                    table: {
                        widths: ['*'],
                        body: [
                            [{ text: [{ text: 'Domicilio: ', bold: true }, model.address] }]
                        ],
                    },
                    layout: 'noBorders'
                }, {
                    style: 'table',
                    table: {
                        widths: ['*', '*', '*'],
                        body: [
                            [
                                { text: [{ text: 'Provincia: ', bold: true }, model.province.name] },
                                { text: [{ text: 'Ciudad: ', bold: true }, model.city.name] },
                                { text: [{ text: 'Parroquia: ', bold: true }, model.parish.name] },
                            ]
                        ]
                    },
                    layout: 'noBorders'
                }, {
                    style: 'tableHeader',
                    table: {
                        widths: ['*'],
                        body: [
                            [{ text: 'Discapacidad', bold: true }]
                        ]
                    },
                    layout: { fillColor: '#CCCCCC', border: 0 }
                }, {
                    style: 'table',
                    table: {
                        widths: ['*', '*', '*', '*', '*'],
                        body: [
                            [{ colSpan: 5, text: 'Tipo de Discapacidad', bold: true }, {}, {}, {}, {}],
                            [
                                { text: [{ text: 'Física: ', bold: true }, model.physical_disability + '%'] },
                                { text: [{ text: 'Intelectual: ', bold: true }, model.intellectual_disability + '%'] },
                                { text: [{ text: 'Visual: ', bold: true }, model.visual_disability + '%'] },
                                { text: [{ text: 'Auditiva: ', bold: true }, model.hearing_disability + '%'] },
                                { text: [{ text: 'Psicosocial: ', bold: true }, model.psychosocial_disability + '%'] },
                            ]
                        ]
                    },
                    layout: 'noBorders'
                }, {
                    style: 'table',
                    table: {
                        widths: ['*', '*', '*'],
                        body: [
                            [
                                { text: [{ text: 'Grado de Discapacidad: ', bold: true }, _this.getGradeDisability(model.grade_of_disability)] },
                                { text: [{ text: 'Tiene Diagnóstico?: ', bold: true }, model.has_diagnostic == 1 ? 'Si' : 'No'] },
                                { text: [{ text: 'Diagnóstico: ', bold: true }, model.pathology.name == null || model.pathology.name == '' ? '' : model.pathology.name] },
                            ],
                            [
                                { colSpan: 3, text: [{ text: 'Otros Diagnósticos: ', bold: true }, model.other_diagnostic == null || model.other_diagnostic == '' ? '' : model.other_diagnostic] },
                                {},
                                {}
                            ]
                        ]
                    },
                    layout: 'noBorders'
                }, {
                    style: 'table',
                    table: {
                        widths: ['*'],
                        body: [
                            [{ text: [{ text: 'Entidad que emite el Diagnóstico: ', bold: true }, model.entity_send_diagnostic == null || model.entity_send_diagnostic == '' ? '' : model.entity_send_diagnostic] }]
                        ]
                    },
                    layout: 'noBorders'

                }, {
                    style: 'table',
                    table: {
                        widths: ['*', '*'],
                        body: [
                            [
                                { text: [{ text: 'Asiste a otros centros terapéuticos: ', bold: true }, model.assist_other_therapeutic_center == '1' ? 'Si' : 'No'] },
                                { text: [{ text: 'Nombre de la Institución: ', bold: true }, model.therapeutic_center_name == null || model.therapeutic_center_name == '' ? '' : model.therapeutic_center_name] },

                            ]
                        ]
                    },
                    layout: 'noBorders'

                }, {
                    style: 'tableHeader',
                    table: {
                        widths: ['*'],
                        body: [
                            [{ text: 'Asistencia Médica', bold: true }]
                        ]
                    },
                    layout: {
                        fillColor: '#CCCCCC',
                        border: 0
                    }
                }, {
                    style: 'table',
                    table: {
                        widhts: ['*', '*'],
                        body: [
                            [
                                { text: [{ text: 'Tiene algún tipo de seguro: ', bold: true }, _this.getHasTypeInsurance(model.has_insurance)] },
                                { text: [{ text: 'Recibe atención Medica en: ', bold: true }, _this.getNameMedicalAttention(model.receives_medical_attention)] },
                            ]
                        ]

                    },
                    layout: 'noBorders'
                }, {
                    style: 'table',
                    table: {
                        widhts: ['*'],
                        body: [
                            [
                                { text: [{ text: 'Nombre de la Institución: ', bold: true }, model.name_medical_attention == '' || model.name_medical_attention == null ? '' : model.name_medical_attention] },
                            ]
                        ]

                    },
                    layout: 'noBorders'
                }, {
                    style: 'tableHeader',
                    table: {
                        widths: ['*'],
                        body: [
                            [{ text: 'Educación Formal', bold: true }]
                        ]
                    },
                    layout: {
                        fillColor: '#CCCCCC',
                        border: 0
                    }
                }, {
                    style: 'table',
                    table: {
                        widhts: ['*', '*', '*'],
                        body: [
                            [
                                { text: [{ text: 'Escolarización: ', bold: true }, _this.getHasSchooling(model.schooling)] },
                                { text: [{ text: 'Tipo Escolarización: ', bold: true }, _this.getHasSchoolingType(model.schooling_type)] },
                            ]
                        ]

                    },
                    layout: 'noBorders'
                }, {
                    style: 'table',
                    table: {
                        widhts: ['*'],
                        body: [
                            [
                                { pageBreak: 'after', text: [{ text: 'Nombre de la Institución: ', bold: true }, model.schooling_name == null || model.schooling_name == '' ? '' : model.schooling_name] },
                            ]
                        ]

                    },
                    layout: 'noBorders'
                }, {
                    text: 'DATOS DE FAMILIARES',
                    bold: true,
                    fontSize: 12,
                    decoration: 'underline'
                }, {
                    style: 'tableHeader',
                    table: {
                        widths: ['*'],
                        body: [
                            [{ text: 'Datos del Padre', bold: true }]
                        ]
                    },
                    layout: {
                        fillColor: '#CCCCCC',
                        border: 0
                    }
                }, {
                    style: 'table',
                    table: {
                        widhts: ['*'],
                        body: [
                            [
                                { text: [{ text: 'Nombre del Padre: ', bold: true }, model.father.last_name + ' ' + model.father.name] },
                            ]
                        ]

                    },
                    layout: 'noBorders'
                }, {
                    style: 'table',
                    table: {
                        widhts: ['*', '*', '*', '*'],
                        body: [
                            [
                                { text: [{ text: 'Cédula de Identidad: ', bold: true }, model.father.num_identification] },
                                { text: [{ text: 'Fecha de Nacimiento: ', bold: true }, moment(model.father.date_birth).format('DD/MM/YYYY')] },
                                { text: [{ text: 'Edad: ', bold: true }, model.father.age == '' || model.father.age == null ? '' : model.father.age] },
                                { text: [{ text: 'Teléfono: ', bold: true }, model.father.phone == '' || model.father.phone == null ? '' : model.father.phone] },
                            ]
                        ]

                    },
                    layout: 'noBorders'
                }, {
                    style: 'table',
                    table: {
                        widhts: ['*', '*'],
                        body: [
                            [{
                                    text: [{ text: 'Móvil: ', bold: true }, model.father.mobile == '' || model.father.mobile == null ? '' : model.father.mobile]
                                },
                                { text: [{ text: 'Actividad en la que labora: ', bold: true }, model.father.activity == '' || model.father.activity == null] ? '' : model.father.activity },
                            ]
                        ]

                    },
                    layout: 'noBorders'
                }, {
                    style: 'tableHeader',
                    table: {
                        widths: ['*'],
                        body: [
                            [{ text: 'Datos de la Madre', bold: true }]
                        ]
                    },
                    layout: {
                        fillColor: '#CCCCCC',
                        border: 0
                    }
                }, {
                    style: 'table',
                    table: {
                        widhts: ['*'],
                        body: [
                            [
                                { text: [{ text: 'Nombre de la Madre: ', bold: true }, model.mother.last_name + ' ' + model.mother.name] },
                            ]
                        ]

                    },
                    layout: 'noBorders'
                }, {
                    style: 'table',
                    table: {
                        widhts: ['*', '*', '*', '*'],
                        body: [
                            [
                                { text: [{ text: 'Cédula de Identidad: ', bold: true }, model.mother.num_identification] },
                                { text: [{ text: 'Fecha de Nacimiento: ', bold: true }, moment(model.mother.date_birth).format('DD/MM/YYYY')] },
                                { text: [{ text: 'Edad: ', bold: true }, model.mother.age == '' || model.mother.age == null ? '' : model.mother.age] },
                                { text: [{ text: 'Teléfono: ', bold: true }, model.mother.phone == '' || model.mother.phone == null ? '' : model.mother.phone] },
                            ]
                        ]

                    },
                    layout: 'noBorders'
                }, {
                    style: 'table',
                    table: {
                        widhts: ['*', '*'],
                        body: [
                            [{
                                    text: [{ text: 'Móvil: ', bold: true }, model.mother.mobile == '' || model.mother.mobile == null ? '' : model.mother.mobile]
                                },
                                { text: [{ text: 'Actividad en la que labora: ', bold: true }, model.mother.activity == '' || model.mother.activity == null ? '' : model.mother.activity] },
                            ]
                        ]

                    },
                    layout: 'noBorders'
                }, {
                    style: 'tableHeader',
                    table: {
                        widths: ['*'],
                        body: [
                            [{ text: 'Datos del Representante', bold: true }]
                        ]
                    },
                    layout: {
                        fillColor: '#CCCCCC',
                        border: 0
                    }
                }, {
                    style: 'table',
                    table: {
                        widhts: ['*'],
                        body: [
                            [
                                { text: [{ text: 'Nombre del Representante: ', bold: true }, model.representant.last_name + ' ' + model.representant.name] },
                            ]
                        ]

                    },
                    layout: 'noBorders'
                }, {
                    style: 'table',
                    table: {
                        widhts: ['*', '*', '*', '*'],
                        body: [
                            [
                                { text: [{ text: 'Cédula de Identidad: ', bold: true }, model.representant.num_identification == '' || model.representant.num_identification == null ? '' : model.representant.num_identification] },
                                { text: [{ text: 'Fecha de Nacimiento: ', bold: true }, moment(model.representant.date_birth).format('DD/MM/YYYY')] },
                                { text: [{ text: 'Edad: ', bold: true }, model.representant.age == '' || model.representant.age == null ? '' : model.representant.age] },
                                { text: [{ text: 'Teléfono: ', bold: true }, model.representant.phone == null || model.representant.phone == '' ? '' : model.representant.phone] },
                            ]
                        ]

                    },
                    layout: 'noBorders'
                }, {
                    style: 'table',
                    table: {
                        widhts: ['*', '*'],
                        body: [
                            [
                                { text: [{ text: 'Género: ', bold: true }, model.representant.genre == 'M' ? 'Masculino' : 'Femenino'] },
                                { text: [{ text: 'Móvil: ', bold: true }, model.representant.mobile == '' || model.representant.mobile == null ? '' : model.representant.mobile] },
                            ]
                        ]

                    },
                    layout: 'noBorders'
                }, {
                    style: 'table',
                    table: {
                        widhts: ['*'],
                        body: [
                            [
                                { text: [{ text: 'Actividad en la que labora: ', bold: true }, model.representant.activity == '' || model.representant.activity == null ? '' : model.representant.activity] },
                            ],
                            [
                                { text: [{ text: 'Redes Sociales que Maneja: ', bold: true }, model.representant.has_facebook ? ' Facebook ' : '', model.representant.has_twitter ? ' Twitter ' : '', model.representant.has_instagram ? ' Instagram ' : '', !model.representant.has_instagram && !model.representant.has_facebook && !model.representant.has_twitter ? ' Ninguna ' : ''] }
                            ]
                        ]

                    },
                    layout: 'noBorders'
                }, {
                    margin: [0, 20],
                    table: {
                        widhts: ['*'],
                        body: [
                            [
                                { text: 'Observación: ', bold: true },
                            ],
                            [
                                model.observation == null || model.observation == '' ? '' : model.observation,
                            ],
                        ]

                    },
                    layout: 'noBorders'
                },

                {
                    margin: [0, 30, 0, 0],
                    text: '_________________________________________\n Firma del Representante',
                    bold: true,
                },
                {
                    pageBreak: 'after',
                    margin: [0, 10, 0, 0],
                    text: [{ text: 'Fecha: ', bold: true }, moment(model.date_admission).format('DD/MM/YYYY')],
                    bold: true,
                },
                //CARTA DE COMPROMISO
                { text: 'CARTA DE COMPROMISO', style: 'header' },
                {
                    style: 'content',
                    margin: [0, 20],
                    text: [
                        'Yo, ',
                        { text: model.representant.last_name, bold: true },
                        ' ',
                        { text: model.representant.name, bold: true },
                        ' con CI ',
                        { text: model.representant.num_identification, bold: true },
                        ' Certifico que mi representado/a ',
                        { text: model.last_name, bold: true },
                        ' ',
                        { text: model.last_name, bold: true },
                        ' Con CI ',
                        { text: model.num_identification, bold: true },
                        ', se encuentra bajo mi total responsabilidad en el Centro Integral de Equinoterapia cuando asiste a sus respectivas terapias de rehabilitación y está siempre bajo mi supervisión y cuidado.'
                    ]
                },
                { text: 'Además dejo constancia que he sido informado de lo siguiente:', style: 'content' },
                { text: '-El usuario no podrá tener 3 faltas consecutivas injustificadas, porque será retirado/a  del servicio de Terapias.', style: 'content' },
                { text: '-Solo podrá tener 2 re-ingresos dentro de un mismo año, siempre y cuando haya justificado formalmente las inasistencias, y estará sujeto a disponibilidad de cupo.', style: 'content' },
                { text: '-Se mantendrá permisos de asistencia solo por 1 mes, previamente justificación formal con certificado. Después del mes de permiso deberá realizar el re-ingreso correspondiente.', style: 'content' },
                { text: '-Debe cumplir con los requisitos de inscripción, de lo contrario el usuario será suspendido del servicio de terapias.', style: 'content' },
                { text: 'Teniendo conocimiento de esta información desligo de toda responsabilidad al Centro Integral de Equinoterapia del Gobierno Provincial del Guayas.', style: 'content' },
                {
                    alignment: 'center',
                    fontSize: 12,
                    margin: [0, 90],
                    columns: [{
                        text: '___________________________________\nFirma del Representante \n\n Fecha: _____________________ \n Celular: _____________________'
                    }],
                    pageBreak: 'after'

                },
                //CARTA DE AUTORIZACION
                { text: 'CARTA DE AUTORIZACIÓN \n DE USO DE IMAGEN', style: 'header', margin: [0, 0, 0, 60] },
                {
                    style: 'content',
                    lineHeight: 2.0,
                    margin: [0, 20],
                    text: [
                        'Yo, ',
                        { text: model.representant.last_name, bold: true },
                        ' ',
                        { text: model.representant.name, bold: true },
                        ' Ecuatoriano/a, Mayor de edad, domiciliado en ',
                        { text: model.address, bold: true },
                        ' Identificado/a con número de CI. ',
                        { text: model.representant.num_identification, bold: true },
                        ' de ',
                        { text: model.representant.age, bold: true },
                        ' años de edad, autorizo la realización de tomas fotográficas y de video a mi hijo/a ',
                        { text: model.last_name, bold: true },
                        ' ',
                        { text: model.last_name, bold: true },
                        ', para USO EN MEDIOS DE COMUNICACIÓN Y REDES SOCIALES DE LA PREFECTURA DEL GUAYAS, a difundirse a nivel nacional.',
                    ]
                },
                { text: 'Declaro conocer las condiciones que involucran el uso de las imágenes para los fines señalados.', style: 'content' },
                {
                    alignment: 'center',
                    fontSize: 12,
                    margin: [0, 90],
                    columns: [{
                        text: '___________________________________\nFirma del Representante \n\n Fecha: _____________________ \n Celular: _____________________'
                    }]

                },



            ]
        };

        _this.loadPrintsDocs = function(model) {
            var deferred = $q.defer();
            layoutReportFactory.getLayout({
                margins: {
                    left: 30,
                    top: 120,
                    right: 30,
                    bottom: 45
                }
            }).then(function(layout) {
                var letter = layout;
                var styleDoc = {
                    table: {
                        fontSize: 12,
                        alignment: 'left',
                    },
                    tableHeader: {
                        fontSize: 12,
                        alignment: 'left',
                        margin: [0, 20, 0, -0],
                    }
                };
                angular.extend(letter.styles, styleDoc)
                letter.content = _this.loadLetterEngagement(model);
                deferred.resolve(letter)
            });
            return deferred.promise;
        }

    }]);

    app.register.controller('pUserInscriptionIdxCtrl', ['$scope', 'apiResource', '$stateParams', 'DTOptionsBuilder', 'PUserInscriptionService', '$rootScope', function($scope, apiResource, $stateParams, DTOptionsBuilder, PUserInscriptionService, $rootScope) {

        $scope.inscriptions = [];
        $scope.loading = true;
        $scope.dtOptions = DTOptionsBuilder.newOptions().withBootstrap();
        $scope.messages = {};
        $scope.hasMessage = false;

        angular.extend($scope.dtOptions, {
            orderable: false,
            columnDefs: [{
                orderable: false,
                targets: 3
            }],
            order: [
                [0, 'asc'],
                [1, 'asc'],
                [2, 'asc'],
            ],
            responsive: true
        });

        apiResource.resource('puserinscriptions').queryCopy().then(function(results) {
            $scope.loading = false;
            $scope.inscriptions = results;
            $scope.messages = PUserInscriptionService.messageFlag;
            if (!_.isEmpty($scope.messages)) {
                $scope.hasMessage = true;
                PUserInscriptionService.messageFlag = {};
            }
        });

        $scope.print = function(inscripId) {
            apiResource.resource('puserinscriptions').getCopy(inscripId).then(function(result) {
                PUserInscriptionService.loadPrintsDocs(result).then(function(docDefinition) {
                    var params = {
                        type: 'pdf',
                        content: docDefinition,
                        title: result.last_name + ' ' + result.name
                    };
                    $rootScope.openPreviewModal(params);


                });
            })
        }

        $scope.delete = function(id) {
            apiResource.resource('puserinscriptions').getCopy(id).then(function(object) {
                var params = {
                    title: 'Atención',
                    text: 'Desea eliminar la Solicitud de ' + object.name + ' ' + object.last_name + '.?'
                }
                $rootScope.openDelteModal(params).then(function() {
                    var idx = _.findIndex($scope.inscriptions, function(el) {
                        return el.id == object.id;
                    });
                    if (idx > -1) {
                        $scope.inscriptions[idx].$deleting = true;
                        object.$delete(function() {
                            PUserInscriptionService.messageFlag.title = "Solicitud eliminada correctamente";
                            PUserInscriptionService.messageFlag.type = "info";
                            $scope.messages = PUserInscriptionService.messageFlag;
                            $scope.hasMessage = true;
                            $scope.inscriptions[idx].$deleting = false;
                            $scope.inscriptions.splice(idx, 1);
                            apiResource.resource('puserinscriptions').removeFromCache(object.id);
                        })
                    }
                })
            });
        };
    }]);

    app.register.controller('pUserInscriptionCreateCtrl', ['$scope', 'apiResource', '$stateParams', 'DTOptionsBuilder', 'PUserInscriptionService', '$q', '$state', function($scope, apiResource, $stateParams, DTOptionsBuilder, PUserInscriptionService, $q, $state) {

        $scope.isEdit = false
        $scope.loading = true;
        $scope.saving = false;
        $scope.existError = false;
        $scope.model = {};
        $scope.provinces = [];
        $scope.messages = {};
        $scope.cities = [];
        $scope.parishies = [];
        $scope.pathologies = [];
        $scope.representant = {
            family: 1
        };
        $scope.states = [];

        $scope.porcentages = PUserInscriptionService.getPorcentages();
        $scope.gradeDisability = PUserInscriptionService.gradeDisability;
        $scope.hasDiagnostic = PUserInscriptionService.yesOrNot;
        $scope.assistOtherTherapeuticCenter = PUserInscriptionService.yesOrNot;
        $scope.insurances = PUserInscriptionService.insurances;
        $scope.medicalCenters = PUserInscriptionService.medicalAttentions;
        $scope.medicalCenters = PUserInscriptionService.medicalAttentions;
        $scope.scooling = PUserInscriptionService.scooling;
        $scope.scoolingType = PUserInscriptionService.scoolingType;
        $scope.statusCivil = PUserInscriptionService.statusCivil;
        $scope.usrLiveWith = PUserInscriptionService.usrLiveWith;
        $scope.representants = PUserInscriptionService.representants;
        $scope.states = PUserInscriptionService.statesForm;


        var deps = $q.all([
            apiResource.resource('provinces').queryCopy().then(function(provinces) {
                $scope.provinces = provinces;
            }),
            apiResource.resource('cities').queryCopy().then(function(cities) {
                $scope.cities = cities;
            }),
            apiResource.resource('parishies').queryCopy().then(function(parishies) {
                $scope.parishies = parishies;
            }),
            apiResource.resource('pathologies').queryCopy().then(function(pathologies) {
                $scope.pathologies = pathologies;
            }),
        ]);

        deps.then(function() {
            $scope.model = apiResource.resource('puserinscriptions').create({
                has_diagnostic: null,
                city_id: null,
                parish_id: null,
                assist_other_therapeutic_center: null,
                receives_medical_attention: null,
                state: 2,
                date_admission: new Date(),
                schooling: null,
                representant: {},
                mother: {
                    is_representant: 1
                },
                father: {}
            });
            $scope.loading = false;
        });

        $scope.validateOptions = {
            rules: {
                num_identification: {
                    required: true,
                    minlength: 10,
                    maxlength: 10,
                    isValidId: true,
                    uniquePatient: 'num_identification'
                },
                name: {
                    required: true
                },
                last_name: {
                    required: true
                },
                date_birth: {
                    required: true,
                    date: true
                },
                age: {
                    required: true,
                    number: true,
                },
                genre: {
                    valueNotEquals: '? undefined:undefined ?',
                },
                address: {
                    required: true,
                    minlength: 10,
                },
                province_id: {
                    valueNotEquals: '?',
                },
                city_id: {
                    required: function() {
                        return $("#province_id").val() == '?';
                    },
                    valueNotEquals: '?',
                },
                parish_id: {
                    required: function() {
                        return $("#city_id").val() == '?';
                    },
                    valueNotEquals: '?',
                },
                physical_disability: {
                    valueNotEquals: '?',
                },
                intellectual_disability: {
                    valueNotEquals: '?',
                },
                visual_disability: {
                    valueNotEquals: '?',
                },
                psychosocial_disability: {
                    valueNotEquals: '?',
                },
                hearing_disability: {
                    valueNotEquals: '?',
                },
                conadis_id: {
                    required: true
                },
                grade_of_disability: {
                    valueNotEquals: '?'
                },
                has_diagnostic: {
                    valueNotEquals: '?'
                },
                diagnostic_id: {
                    valueNotEquals: '?'
                },
                entity_send_diagnostic: {
                    required: true
                },
                assist_other_therapeutic_center: {
                    valueNotEquals: '?'
                },
                state: {
                    valueNotEquals: '?'
                },
                therapeutic_center_name: {
                    required: function(element) {
                        return $("#assist_other_therapeutic_center").val() == 1;
                    }
                },
                has_insurance: {
                    valueNotEquals: '?'
                },
                receives_medical_attention: {
                    valueNotEquals: '?'
                },
                name_medical_attention: {
                    required: function(element) {
                        return $("#receives_medical_attention").val() == 1 || $("#receives_medical_attention").val() > 3;
                    }
                },
                schooling: {
                    valueNotEquals: '?'
                },
                schooling_type: {
                    valueNotEquals: '?'
                },
                schooling_name: {
                    required: true
                },
                father_num_identification: {
                    required: true,
                    minlength: 10,
                    maxlength: 10,
                    isValidId: true,
                    notEqualtTo: ["#num_identification", '#mother_num_identification', '#representant_num_identification'],

                },
                father_name: {
                    required: true
                },
                father_lastname: {
                    required: true
                },
                father_date_birth: {
                    required: true,
                    date: true
                },
                father_age: {
                    required: true,
                    number: true,
                    min: 18,
                    max: 99
                },
                father_mobile: {
                    required: true,
                    number: true,
                    maxlength: 10,
                    minlength: 10,
                },
                father_activity: {
                    required: true,
                },
                mother_num_identification: {
                    required: true,
                    minlength: 10,
                    maxlength: 10,
                    isValidId: true,
                    notEqualtTo: ["#num_identification", "#father_num_identification", "#representant_num_identification"],
                },
                mother_name: {
                    required: true
                },
                mother_lastname: {
                    required: true
                },
                mother_date_birth: {
                    required: true,
                    date: true
                },
                mother_age: {
                    required: true,
                    number: true,
                    min: 18,
                    max: 99
                },
                mother_mobile: {
                    required: true,
                    number: true,
                    maxlength: 10,
                    minlength: 10,
                },
                mother_activity: {
                    required: true,
                    minlength: 10,
                },
                parent_status_civil: {
                    valueNotEquals: '?'
                },
                user_live_with: {
                    valueNotEquals: '?'
                },
                representant_num_identification: {
                    required: true,
                    minlength: 10,
                    maxlength: 10,
                    isValidId: true,
                    notEqualtTo: ["#num_identification", "#father_num_identification", "#mother_num_identification"],
                },
                representant_name: {
                    required: true
                },
                representant_lastname: {
                    required: true
                },
                representant_date_birth: {
                    required: true,
                    date: true
                },
                representant_age: {
                    required: true,
                    number: true,
                    min: 18,
                    max: 99
                },
                representant_mobile: {
                    required: true,
                    number: true,
                    maxlength: 10,
                    minlength: 10,
                },
                representant_activity: {
                    required: true
                }

            },
            messages: {
                date_admission: {
                    max: 'Ingrese un valor menor o igual a {0}'
                },
                num_identification: {
                    required: "Identificación requerida",
                    minlength: "Identificación inválida",
                    maxlength: "Identificación inválida",
                    isValidId: "Identificación inválida",
                    uniquePatient: 'Ya existe un usuario registrado'
                },
                name: {
                    required: "Nombre Requerido"
                },
                last_name: {
                    required: "Apellido Requerido"
                },
                date_birth: {
                    required: "Fecha Nacimiento Requerida",
                    date: "La Fecha es Inválida",
                },
                age: {
                    required: "La Edad es Requerida",
                    number: true,
                    max: "Edad Incorrecta"
                },
                genre: {
                    valueNotEquals: 'Género requerido',
                },
                address: {
                    required: "Domicilio Requerida",
                    minlength: "Ingrese al menos 10 carácteres",
                },
                province_id: {
                    valueNotEquals: 'Provincia Requerida',
                },
                city_id: {
                    valueNotEquals: 'Ciudad Requerida',
                },
                parish_id: {
                    valueNotEquals: 'Parroquia Requerida',
                },
                physical_disability: {
                    valueNotEquals: 'D. Requerida',
                },
                intellectual_disability: {
                    valueNotEquals: 'D. Requerida',
                },
                visual_disability: {
                    valueNotEquals: 'D. Requerida',
                },
                hearing_disability: {
                    valueNotEquals: 'D. Requerida',
                },
                psychosocial_disability: {
                    valueNotEquals: 'D. Requerida',
                },
                conadis_id: {
                    required: "Conadis Requerida"
                },
                grade_of_disability: {
                    valueNotEquals: 'Es Requerida'
                },
                has_diagnostic: {
                    valueNotEquals: 'Es Requerio'
                },
                diagnostic_id: {
                    valueNotEquals: 'Es Requerida'
                },
                entity_send_diagnostic: {
                    required: "Es Requerida"
                },
                assist_other_therapeutic_center: {
                    valueNotEquals: 'Es Requerida'
                },
                therapeutic_center_name: {
                    required: 'Es Requerida'
                },
                has_insurance: {
                    valueNotEquals: 'Es Requerida'
                },
                receives_medical_attention: {
                    valueNotEquals: 'Es Requerida'
                },
                name_medical_attention: {
                    required: 'Es Requerida'
                },
                schooling: {
                    valueNotEquals: 'Es Requerida'
                },
                schooling_type: {
                    valueNotEquals: 'Es Requerida'
                },
                schooling_name: {
                    required: 'Es Requerida'
                },
                father_num_identification: {
                    required: 'Es Requerida',
                    minlength: 'Es Inválido',
                    maxlength: 'Es Inválido',
                    isValidId: 'Es Inválido',
                    notEqualtTo: "Por favor, ingrese una cédula que no se repita",
                },
                father_name: {
                    required: 'Es Requerida',
                },
                father_lastname: {
                    required: 'Es Requerida',
                },
                father_date_birth: {
                    required: 'Es Requerida',
                    date: "Es Inválida"
                },
                father_age: {
                    required: 'Es Requerida',
                    number: 'Es Inválida',
                    min: 'Es Inválida',
                    max: 'Es Inválida'
                },
                father_mobile: {
                    required: 'Es Requerida',
                    number: 'Es Inválido',
                    maxlength: 'Es Inválido',
                    minlength: 'Es Inválido'
                },
                father_activity: {
                    required: 'Es Requerida',
                },
                mother_num_identification: {
                    required: "Es Requerida",
                    minlength: 'Es Inválida',
                    maxlength: 'Es Inválida',
                    isValidId: 'Es Inválida',
                    notEqualtTo: "Por favor, ingrese una cédula que no se repita",
                },
                mother_name: {
                    required: "Es Requerida",
                },
                mother_lastname: {
                    required: "Es Requerida",
                },
                mother_date_birth: {
                    required: "Es Requerida",
                    date: 'Es Inválida',
                },
                mother_age: {
                    required: "Es Requerida",
                    number: 'Es Inválida',
                    min: 'Es Inválida',
                    max: 'Es Inválida',
                },
                mother_mobile: {
                    required: "Es Requerida",
                    number: 'Es Inválida',
                    maxlength: 'Es Inválida',
                    minlength: 'Es Inválida',
                },
                mother_activity: {
                    required: "Es Requerida",
                    minlength: 'Ingrese al menos 10 carácteres',
                },
                parent_status_civil: {
                    valueNotEquals: "Es Requerida"
                },
                user_live_with: {
                    valueNotEquals: "Es Requerida"
                },
                representant_num_identification: {
                    required: "Es Requerida",
                    minlength: 'Es Inválida',
                    maxlength: 'Es Inválida',
                    isValidId: 'Es Inválida',
                    notEqualtTo: "Por favor, ingrese una cédula que no se repita",
                },
                representant_name: {
                    required: "Es Requerida",
                },
                representant_lastname: {
                    required: "Es Requerida",
                },
                representant_date_birth: {
                    required: "Es Requerida",
                    date: 'Es Inválida',
                },
                representant_age: {
                    required: "Es Requerida",
                    number: 'Es Inválida',
                    min: 'Es Inválida',
                    max: 'Es Inválida',
                },
                representant_mobile: {
                    required: "Es Requerida",
                    number: 'Es Inválida',
                    maxlength: 'Es Inválida',
                    minlength: 'Es Inválida',
                },
                representant_activity: {
                    required: "Es Requerida",
                },
                state: {
                    valueNotEquals: 'Es Requerido'
                }
            }
        }


        $scope.calculateAge = function(dateBirth) {
            $scope.model.age = PUserInscriptionService.calculateAge(dateBirth);
        };

        $scope.calculateAgeFather = function(dateBirth) {
            $scope.model.father.age = PUserInscriptionService.calculateAge(dateBirth);
        };

        $scope.calculateAgeMother = function(dateBirth) {
            $scope.model.mother.age = PUserInscriptionService.calculateAge(dateBirth);
        };

        $scope.calculateAgeRepresentant = function(dateBirth) {
            $scope.model.representant.age = PUserInscriptionService.calculateAge(dateBirth);
        };


        $scope.filterCities = function(value) {
            if (value.province_id == $scope.model.province_id) return value;
            return false;
        }

        $scope.filterParishies = function(value) {
            if (value.city_id == $scope.model.city_id) return value;
            return false;
        }


        $scope.changeRepresentant = function() {
            $scope.model = PUserInscriptionService.changeRepresentant($scope.model, $scope.representant);
        }

        $scope.save = function(saveForm, returnIndex) {
            var successCallback = function(data) {
                $scope.saving = false;
                $scope.hasMessage = true;
                apiResource.resource('puserinscriptions').setOnCache(data);
                PUserInscriptionService.messageFlag.title = "Solicitud de  " + $scope.model.name + ' ' + $scope.model.last_name + " Ingresada correctamente";
                PUserInscriptionService.messageFlag.type = "info";
                $scope.messages = PUserInscriptionService.messageFlag;
                if (returnIndex) {
                    $state.go('root.inscription');
                } else {
                    $state.go('root.inscription.edit', {
                        pInsId: data.id
                    })
                }
            }

            var failCallback = function(reason) {
                $scope.saving = false
                $scope.existError = true;
                $scope.messages.title = reason.data.title;
                $scope.messages.type = 'error';
                $scope.messages.details = [];
                var json = JSON.parse(reason.data.detail);
                angular.forEach(json, function(elem, idx) {
                    angular.forEach(elem, function(el, idex) {
                        $scope.messages.details.push(el)
                    })
                })
            }

            if (saveForm.validate()) {
                $scope.saving = true;
                // $scope.changeRepresentant();
                PUserInscriptionService.save($scope.model).then(successCallback, failCallback);
            }
        };

        $scope.saveAndClose = function(form) {
            $scope.save(form, true);
        }
    }]);

    app.register.controller('pUserInscriptionEditCtrl', ['$scope', 'apiResource', '$stateParams', 'DTOptionsBuilder', 'PUserInscriptionService', '$q', '$state', '$sce', function($scope, apiResource, $stateParams, DTOptionsBuilder, PUserInscriptionService, $q, $state, $sce) {

        var inscriptionId = $stateParams.pInsId;
        $scope.isEdit = true
        $scope.docContent = null;
        $scope.hasMessage = false;
        $scope.messages = {};
        $scope.loading = true;
        $scope.model = {};
        $scope.provinces = [];
        $scope.cities = [];
        $scope.parishies = [];
        $scope.pathologies = [];
        $scope.representant = {
            family: 1
        };
        $scope.states = [];

        $scope.porcentages = PUserInscriptionService.getPorcentages();
        $scope.gradeDisability = PUserInscriptionService.gradeDisability;
        $scope.hasDiagnostic = PUserInscriptionService.yesOrNot;
        $scope.assistOtherTherapeuticCenter = PUserInscriptionService.yesOrNot;
        $scope.insurances = PUserInscriptionService.insurances;
        $scope.medicalCenters = PUserInscriptionService.medicalAttentions;
        $scope.medicalCenters = PUserInscriptionService.medicalAttentions;
        $scope.scooling = PUserInscriptionService.scooling;
        $scope.scoolingType = PUserInscriptionService.scoolingType;
        $scope.statusCivil = PUserInscriptionService.statusCivil;
        $scope.usrLiveWith = PUserInscriptionService.usrLiveWith;
        $scope.representants = PUserInscriptionService.representants;
        $scope.states = PUserInscriptionService.statesForm;



        var deps = $q.all([
            apiResource.resource('provinces').queryCopy().then(function(provinces) {
                $scope.provinces = provinces;
            }),
            apiResource.resource('cities').queryCopy().then(function(cities) {
                $scope.cities = cities;
            }),
            apiResource.resource('parishies').queryCopy().then(function(parishies) {
                $scope.parishies = parishies;
            }),
            apiResource.resource('pathologies').queryCopy().then(function(pathologies) {
                $scope.pathologies = pathologies;
            }),
        ]);

        deps.then(function() {
            apiResource.resource('puserinscriptions').getCopy(inscriptionId).then(function(model) {
                $scope.model = model;
                $scope.model.date_birth = new Date($scope.model.date_birth);
                $scope.model.date_admission = new Date($scope.model.date_admission);
                $scope.model.mother.date_birth = new Date($scope.model.mother.date_birth);
                $scope.model.father.date_birth = new Date($scope.model.father.date_birth);
                $scope.model.representant.date_birth = new Date($scope.model.representant.date_birth);

                if ($scope.model.representant_id == $scope.model.mother.id) {
                    $scope.model.mother.is_representant = 1;
                    $scope.representant.family = 1;
                    $scope.model.representant = {};
                } else if ($scope.model.representant_id == $scope.model.father.id) {
                    $scope.model.father.is_representant = 1;
                    $scope.representant.family = 2;
                    $scope.model.representant = {};
                } else {
                    $scope.representant.family = 3;
                }

                $scope.messages = PUserInscriptionService.messageFlag;
                if (!_.isEmpty($scope.messages)) {
                    $scope.hasMessage = true;
                    PUserInscriptionService.messageFlag = {};
                }
                $scope.loading = false;
            });
        });

        $scope.calculateAge = function(dateBirth) {
            $scope.model.age = PUserInscriptionService.calculateAge(dateBirth);
        };

        $scope.calculateAgeFather = function(dateBirth) {
            $scope.model.father.age = PUserInscriptionService.calculateAge(dateBirth);
        };

        $scope.calculateAgeMother = function(dateBirth) {
            $scope.model.mother.age = PUserInscriptionService.calculateAge(dateBirth);
        };

        $scope.calculateAgeRepresentant = function(dateBirth) {
            $scope.model.representant.age = PUserInscriptionService.calculateAge(dateBirth);
        };


        $scope.filterCities = function(value) {
            if (value.province_id == $scope.model.province_id) return value;
            return false;
        }

        $scope.filterParishies = function(value) {
            if (value.city_id == $scope.model.city_id) return value;
            return false;
        }

        $scope.changeRepresentant = function() {
            $scope.model = PUserInscriptionService.changeRepresentant($scope.model, $scope.representant);
        }

        $scope.loadDocs = function(option) {
            if (!option) $scope.loadingDocs = true;
            apiResource.resource('puserinscriptions').getCopy(inscriptionId).then(function(result) {
                PUserInscriptionService.loadPrintsDocs(result).then(function(docDefinition) {
                    if (option == 'print') {
                        pdfMake.createPdf(docDefinition).print();
                    } else if (option == 'download') {
                        pdfMake.createPdf(docDefinition).download($scope.model.last_name + ' ' + $scope.model.name + '_' + moment().format('l'))
                    } else {
                        pdfMake.createPdf(docDefinition).getBase64(function(doc) {
                            $scope.docContent = $sce.trustAsResourceUrl('data:application/pdf;base64,' + doc);
                            $scope.loadingDocs = false;
                            $scope.$apply();
                        })
                    }
                });
            })
        };


        $scope.validateOptions = {
            rules: {
                num_identification: {
                    required: true,
                    minlength: 10,
                    maxlength: 10,
                    isValidId: true,
                    uniquePatient: 'num_identification,' + inscriptionId
                },
                name: {
                    required: true
                },
                last_name: {
                    required: true
                },
                date_birth: {
                    required: true,
                    date: true
                },
                age: {
                    required: true,
                    number: true,
                },
                genre: {
                    valueNotEquals: '? undefined:undefined ?',
                },
                address: {
                    required: true,
                    minlength: 10,
                },
                province_id: {
                    valueNotEquals: '?',
                },
                city_id: {
                    required: function() {
                        return $("#province_id").val() == '?';
                    },
                    valueNotEquals: '?',
                },
                parish_id: {
                    required: function() {
                        return $("#city_id").val() == '?';
                    },
                    valueNotEquals: '?',
                },
                physical_disability: {
                    valueNotEquals: '?',
                },
                state: {
                    valueNotEquals: '?',
                },
                intellectual_disability: {
                    valueNotEquals: '?',
                },
                visual_disability: {
                    valueNotEquals: '?',
                },
                psychosocial_disability: {
                    valueNotEquals: '?',
                },
                hearing_disability: {
                    valueNotEquals: '?',
                },
                conadis_id: {
                    required: true
                },
                grade_of_disability: {
                    valueNotEquals: '?'
                },
                has_diagnostic: {
                    valueNotEquals: '?'
                },
                diagnostic_id: {
                    valueNotEquals: '?'
                },
                entity_send_diagnostic: {
                    required: true
                },
                assist_other_therapeutic_center: {
                    valueNotEquals: '?'
                },
                therapeutic_center_name: {
                    required: function(element) {
                        return $("#assist_other_therapeutic_center").val() == 1;
                    }
                },
                has_insurance: {
                    valueNotEquals: '?'
                },
                receives_medical_attention: {
                    valueNotEquals: '?'
                },
                name_medical_attention: {
                    required: function(element) {
                        return $("#receives_medical_attention").val() == 1 || $("#receives_medical_attention").val() > 3;
                    }
                },
                schooling: {
                    valueNotEquals: '?'
                },
                schooling_type: {
                    valueNotEquals: '?'
                },
                schooling_name: {
                    required: true
                },
                father_num_identification: {
                    required: true,
                    minlength: 10,
                    maxlength: 10,
                    isValidId: true,
                    notEqualtTo: ["#num_identification", '#mother_num_identification', '#representant_num_identification'],

                },
                father_name: {
                    required: true
                },
                father_lastname: {
                    required: true
                },
                father_date_birth: {
                    required: true,
                    date: true
                },
                father_age: {
                    required: true,
                    number: true,
                    min: 18,
                    max: 99
                },
                father_mobile: {
                    required: true,
                    number: true,
                    maxlength: 10,
                    minlength: 10,
                },
                father_activity: {
                    required: true,
                },
                mother_num_identification: {
                    required: true,
                    minlength: 10,
                    maxlength: 10,
                    isValidId: true,
                    notEqualtTo: ["#num_identification", '#father_num_identification', '#representant_num_identification'],
                },
                mother_name: {
                    required: true
                },
                mother_lastname: {
                    required: true
                },
                mother_date_birth: {
                    required: true,
                    date: true
                },
                mother_age: {
                    required: true,
                    number: true,
                    min: 18,
                    max: 99
                },
                mother_mobile: {
                    required: true,
                    number: true,
                    maxlength: 10,
                    minlength: 10,
                },
                mother_activity: {
                    required: true,
                    minlength: 10,
                },
                parent_status_civil: {
                    valueNotEquals: '?'
                },
                user_live_with: {
                    valueNotEquals: '?'
                },
                representant_num_identification: {
                    required: true,
                    minlength: 10,
                    maxlength: 10,
                    isValidId: true,
                    notEqualtTo: ["#num_identification", '#mother_num_identification', '#father_num_identification'],
                },
                representant_name: {
                    required: true
                },
                representant_lastname: {
                    required: true
                },
                representant_date_birth: {
                    required: true,
                    date: true
                },
                representant_age: {
                    required: true,
                    number: true,
                    min: 18,
                    max: 99
                },
                representant_mobile: {
                    required: true,
                    number: true,
                    maxlength: 10,
                    minlength: 10,
                },
                representant_activity: {
                    required: true
                }

            },
            messages: {
                date_admission: {
                    max: 'Ingrese un valor menor o igual a {0}'
                },
                num_identification: {
                    required: "Identificación requerida",
                    minlength: "Identificación inválida",
                    maxlength: "Identificación inválida",
                    isValidId: "Identificación inválida",
                    uniquePatient: 'Ya existe un usuario registrado'
                },
                name: {
                    required: "Nombre Requerido"
                },
                last_name: {
                    required: "Apellido Requerido"
                },
                date_birth: {
                    required: "Fecha Nacimiento Requerida",
                    date: "La Fecha es Inválida",
                },
                age: {
                    required: "La Edad es Requerida",
                    number: true,
                    max: "Edad Incorrecta"
                },
                genre: {
                    valueNotEquals: 'Género requerido',
                },
                address: {
                    required: "Domicilio Requerida",
                    minlength: "Ingrese al menos 10 carácteres",
                },
                province_id: {
                    valueNotEquals: 'Provincia Requerida',
                },
                city_id: {
                    valueNotEquals: 'Ciudad Requerida',
                },
                parish_id: {
                    valueNotEquals: 'Parroquia Requerida',
                },
                physical_disability: {
                    valueNotEquals: 'D. Requerida',
                },
                intellectual_disability: {
                    valueNotEquals: 'D. Requerida',
                },
                visual_disability: {
                    valueNotEquals: 'D. Requerida',
                },
                hearing_disability: {
                    valueNotEquals: 'D. Requerida',
                },
                psychosocial_disability: {
                    valueNotEquals: 'D. Requerida',
                },
                conadis_id: {
                    required: "Conadis Requerida"
                },
                grade_of_disability: {
                    valueNotEquals: 'Es Requerida'
                },
                has_diagnostic: {
                    valueNotEquals: 'Es Requerio'
                },
                diagnostic_id: {
                    valueNotEquals: 'Es Requerida'
                },
                entity_send_diagnostic: {
                    required: "Es Requerida"
                },
                assist_other_therapeutic_center: {
                    valueNotEquals: 'Es Requerida'
                },
                therapeutic_center_name: {
                    required: 'Es Requerida'
                },
                has_insurance: {
                    valueNotEquals: 'Es Requerida'
                },
                receives_medical_attention: {
                    valueNotEquals: 'Es Requerida'
                },
                name_medical_attention: {
                    required: 'Es Requerida'
                },
                schooling: {
                    valueNotEquals: 'Es Requerida'
                },
                schooling_type: {
                    valueNotEquals: 'Es Requerida'
                },
                schooling_name: {
                    required: 'Es Requerida'
                },
                father_num_identification: {
                    required: 'Es Requerida',
                    minlength: 'Es Inválido',
                    maxlength: 'Es Inválido',
                    isValidId: 'Es Inválido',
                    notEqualtTo: "La cédula no puede ser igual a la Identificación",
                },
                father_name: {
                    required: 'Es Requerida',
                },
                father_lastname: {
                    required: 'Es Requerida',
                },
                father_date_birth: {
                    required: 'Es Requerida',
                    date: "Es Inválida"
                },
                father_age: {
                    required: 'Es Requerida',
                    number: 'Es Inválida',
                    min: 'Es Inválida',
                    max: 'Es Inválida'
                },
                father_mobile: {
                    required: 'Es Requerida',
                    number: 'Es Inválido',
                    maxlength: 'Es Inválido',
                    minlength: 'Es Inválido'
                },
                father_activity: {
                    required: 'Es Requerida',
                },
                mother_num_identification: {
                    required: "Es Requerida",
                    minlength: 'Es Inválida',
                    maxlength: 'Es Inválida',
                    isValidId: 'Es Inválida',
                    notEqualtTo: "La cédula no puede ser igual a la Identificación",
                },
                mother_name: {
                    required: "Es Requerida",
                },
                mother_lastname: {
                    required: "Es Requerida",
                },
                mother_date_birth: {
                    required: "Es Requerida",
                    date: 'Es Inválida',
                },
                mother_age: {
                    required: "Es Requerida",
                    number: 'Es Inválida',
                    min: 'Es Inválida',
                    max: 'Es Inválida',
                },
                mother_mobile: {
                    required: "Es Requerida",
                    number: 'Es Inválida',
                    maxlength: 'Es Inválida',
                    minlength: 'Es Inválida',
                },
                mother_activity: {
                    required: "Es Requerida",
                },
                parent_status_civil: {
                    valueNotEquals: "Es Requerida"
                },
                user_live_with: {
                    valueNotEquals: "Es Requerida"
                },
                representant_num_identification: {
                    required: "Es Requerida",
                    minlength: 'Es Inválida',
                    maxlength: 'Es Inválida',
                    isValidId: 'Es Inválida',
                    notEqualtTo: "La cédula no puede ser igual a la Identificación",
                },
                representant_name: {
                    required: "Es Requerida",
                },
                representant_lastname: {
                    required: "Es Requerida",
                },
                representant_date_birth: {
                    required: "Es Requerida",
                    date: 'Es Inválida',
                },
                representant_age: {
                    required: "Es Requerida",
                    number: 'Es Inválida',
                    min: 'Es Inválida',
                    max: 'Es Inválida',
                },
                representant_mobile: {
                    required: "Es Requerida",
                    number: 'Es Inválida',
                    maxlength: 'Es Inválida',
                    minlength: 'Es Inválida',
                },
                representant_activity: {
                    required: "Es Requerida",
                },
                state: {
                    valueNotEquals: 'Es Requerido'
                }
            }
        };

        $scope.save = function(saveForm, returnIndex) {
            var successCallback = function(data) {
                $scope.saving = false;
                $scope.hasMessage = true;
                apiResource.resource('puserinscriptions').setOnCache(data);
                $scope.model.date_birth = new Date($scope.model.date_birth);
                $scope.model.mother.date_birth = new Date($scope.model.mother.date_birth);
                $scope.model.father.date_birth = new Date($scope.model.father.date_birth);
                $scope.model.representant.date_birth = new Date($scope.model.representant.date_birth);

                if ($scope.model.representant_id == $scope.model.mother.id) {
                    $scope.model.mother.is_representant = 1;
                    $scope.representant.family = 1;
                    // $scope.model.representant = {};
                } else if ($scope.model.representant_id == $scope.model.father.id) {
                    $scope.model.father.is_representant = 1;
                    $scope.representant.family = 2;
                    // $scope.model.representant = {};
                } else {
                    $scope.representant.family = 3;
                }

                PUserInscriptionService.messageFlag.title = "Solicitud de  " + $scope.model.name + ' ' + $scope.model.last_name + " Actualizada Correctamente";
                PUserInscriptionService.messageFlag.type = "info";
                $scope.messages = PUserInscriptionService.messageFlag;
                if (returnIndex) {
                    $state.go('root.inscription');
                }
            }

            var failCallback = function(reason) {
                $scope.saving = false
                $scope.existError = true;
                $scope.messages.title = reason.data.title;
                $scope.messages.details = [];
                var json = JSON.parse(reason.data.detail);
                angular.forEach(json, function(elem, idx) {
                    angular.forEach(elem, function(el, idex) {
                        $scope.messages.details.push(el)
                    })
                })
            }

            if (saveForm.validate()) {
                $scope.saving = true;
                PUserInscriptionService.save($scope.model).then(successCallback, failCallback);
            }
        };

        $scope.saveAndClose = function(form) {
            $scope.save(form, true);
        };

    }]);
});