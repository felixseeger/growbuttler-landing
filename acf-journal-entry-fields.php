<?php
/**
 * Register ACF Fields for Journal Entries
 * Add this via Snippets plugin in WordPress admin
 */

add_action('acf/include_fields', function() {
    if (!function_exists('acf_add_local_field_group')) {
        return;
    }

    acf_add_local_field_group(array(
        'key' => 'group_journal_entry_fields',
        'title' => 'Journal Entry Fields',
        'fields' => array(
            array(
                'key' => 'field_plant_id',
                'label' => 'Plant ID',
                'name' => 'plant_id',
                'type' => 'text',
                'instructions' => 'Unique identifier for the plant',
                'required' => 0,
            ),
            array(
                'key' => 'field_plant_name',
                'label' => 'Plant Name',
                'name' => 'plant_name',
                'type' => 'text',
                'instructions' => 'Name of the plant',
                'required' => 0,
            ),
            array(
                'key' => 'field_entry_date',
                'label' => 'Entry Date',
                'name' => 'entry_date',
                'type' => 'date_time_picker',
                'instructions' => 'Date and time of the journal entry',
                'required' => 0,
                'display_format' => 'Y-m-d H:i:s',
                'return_format' => 'Y-m-d H:i:s',
            ),
            array(
                'key' => 'field_day_number',
                'label' => 'Day Number',
                'name' => 'day_number',
                'type' => 'number',
                'instructions' => 'Day number since planting',
                'required' => 0,
            ),
            array(
                'key' => 'field_week_number',
                'label' => 'Week Number',
                'name' => 'week_number',
                'type' => 'number',
                'instructions' => 'Week number since planting',
                'required' => 0,
            ),
            array(
                'key' => 'field_growth_stage',
                'label' => 'Growth Stage',
                'name' => 'growth_stage',
                'type' => 'select',
                'instructions' => 'Current growth stage of the plant',
                'required' => 0,
                'choices' => array(
                    'seedling' => 'Seedling',
                    'vegetative' => 'Vegetative',
                    'flowering' => 'Flowering',
                    'harvest' => 'Harvest',
                ),
                'default_value' => 'seedling',
            ),
            array(
                'key' => 'field_entry_title',
                'label' => 'Entry Title',
                'name' => 'entry_title',
                'type' => 'text',
                'instructions' => 'Title for this journal entry',
                'required' => 0,
            ),
            array(
                'key' => 'field_entry_content',
                'label' => 'Entry Content',
                'name' => 'entry_content',
                'type' => 'textarea',
                'instructions' => 'Detailed content of the journal entry',
                'required' => 0,
                'rows' => 5,
            ),
            array(
                'key' => 'field_entry_type',
                'label' => 'Entry Type',
                'name' => 'entry_type',
                'type' => 'select',
                'instructions' => 'Type of journal entry',
                'required' => 0,
                'choices' => array(
                    'observation' => 'Observation',
                    'action' => 'Action',
                    'note' => 'Note',
                ),
                'default_value' => 'observation',
            ),
            array(
                'key' => 'field_author_type',
                'label' => 'Author Type',
                'name' => 'author_type',
                'type' => 'select',
                'instructions' => 'Who created this entry',
                'required' => 0,
                'choices' => array(
                    'user' => 'User',
                    'expert' => 'Expert',
                    'system' => 'System',
                ),
                'default_value' => 'user',
            ),
        ),
        'location' => array(
            array(
                array(
                    'param' => 'post_type',
                    'operator' => '==',
                    'value' => 'journal_entries',
                ),
            ),
        ),
        'menu_order' => 0,
        'position' => 'normal',
        'style' => 'default',
        'label_placement' => 'top',
        'instruction_placement' => 'label',
        'hide_on_screen' => '',
        'active' => true,
        'description' => 'Fields for journal entry custom post type',
        'show_in_rest' => 1,
    ));
});
