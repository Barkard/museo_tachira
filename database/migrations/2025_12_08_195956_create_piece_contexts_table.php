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
        Schema::create('piece_contexts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('piece_id')->constrained('pieces')->onDelete('cascade');
            $table->string('provenance_location');
            $table->string('bibliographic_references')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('piece_contexts');
    }
};
