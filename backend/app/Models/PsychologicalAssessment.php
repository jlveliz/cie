<?php

namespace Cie\Models;

use  Illuminate\Database\Eloquent\SoftDeletes;
// use Illuminate\Database\Eloquent\Model;

class PsychologicalAssessment extends BaseModel
{
    
    use SoftDeletes;

    protected $table = "psychological_assessment";

    protected $with = ['patientUser'];

    protected $primaryKey = "id";

    protected $casts = [
        'patient_user_id' => 'int',
    ];

    protected $fillable = [
    	'patient_user_id',
        'call_user_in_home',
        'date_eval',
        'father_name',
        'father_age',
        'father_state_civil_id',
        'father_schooling',
        'mother_name',
        'mother_age',
        'mother_state_civil_id',
        'mother_schooling',
        'reason_consultation',
        'background',
        'current_situation',
        'description_beneficiary',
        'affective_social_level_is_nervius',
        'affective_social_level_is_distracted',
        'affective_social_level_is_sensitive',
        'affective_social_level_is_amable',
        'affective_social_level_is_aggressive',
        'affective_social_level_is_shy',
        'affective_social_level_is_friendly',
        'psychological_has_head_blow',
        'affective_social_level_other',
        'affective_social_level_observation',
        'language_level_is_silence',
        'language_level_is_repetitive',
        'language_level_is_stutterer',
        'language_level_is_reluctant_answer',
        'language_level_is_excessive_verbalization',
        'language_level_is_language_expresive',
        'language_level_is_language_comprexive',
        'language_level_other',
        'language_level_observation',
        'physical_level_personal_appearance',
        'physical_level_inadequate_postures',
        'physical_level_physical_malformations',
        'physical_level_is_left_hand',
        'physical_level_is_right_hand',
        'physical_level_observation',
        'cunductual_level_time_sleep_who_sleep',
        'cunductual_needs_someone_what',
        'cunductual_wake_up_frecuence',
        'cunductual_accept_other_food_what',
        'cunductual_has_appetite',
        'cunductual_observation',
        'school_history_is_school',
        'school_history_current',
        'school_history_like_go_school',
        'school_history_generate_problems',
        'school_history_participate_shcool',
        'school_history_observation',
        'medical_take_medicine_what',
        'medical_convulsing_or_convulsed',
        'medical_has_had_surgery',
        'medical_suffered_blows_head',
        'medical_hav_alergy',
        'medical_what_is_the_big_problem',
        'medical_observation',
        'demand_establishment',
        'behaivor_child_interview'
    ];

    public function patientUser()
    {
        return $this->belongsTo('Cie\Models\PatientUser','patient_user_id');
    }
}
