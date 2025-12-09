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
        Schema::create('conservation_statuses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('piece_id')->constrained('pieces')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users');
            $table->date('evaluation_date');
            $table->string('status_details');
            $table->string('applied_intervention');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conservation_statuses');
    }
};
