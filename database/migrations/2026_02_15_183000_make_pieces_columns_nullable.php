<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $columns = [
            'description',
            'author_ethnicity',
            'realization_date',
            'brief_history',
            'photograph_reference',
            'reference_value' // Added reference_value just in case
        ];

        foreach ($columns as $column) {
            // Check if column exists before altering
            if (Schema::hasColumn('pieces', $column)) {
                 DB::statement("ALTER TABLE pieces ALTER COLUMN $column DROP NOT NULL");
            }
        }

        // Handle dimensions separately
        if (!Schema::hasColumn('pieces', 'dimensions')) {
             Schema::table('pieces', function (Blueprint $table) {
                 $table->string('dimensions')->nullable();
             });
        } else {
             DB::statement("ALTER TABLE pieces ALTER COLUMN dimensions DROP NOT NULL");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No revert logic to avoid data issues
    }
};
