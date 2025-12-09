<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pieces', function (Blueprint $table) {
            $table->id();
            $table->foreignId('classification_id')->constrained('classification_categories');
            $table->foreignId('movement_id')->constrained('movements'); // Initial Entry Movement
            $table->string('registration_number');
            $table->string('piece_name');
            $table->string('description');
            $table->string('author_ethnicity');
            $table->string('dimensions');
            $table->string('realization_date');
            $table->string('brief_history');
            $table->decimal('reference_value', 10, 2);
            $table->boolean('is_research_piece');
            $table->string('photograph_reference');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pieces');
    }
};
