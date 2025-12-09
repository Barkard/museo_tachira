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
        Schema::create('movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('movement_type_id')->constrained('movement_catalogs');
            $table->foreignId('agent_id')->constrained('agents');
            $table->foreignId('transaction_status_id')->constrained('transaction_status_catalogs');
            $table->foreignId('user_id')->constrained('users');
            $table->date('entry_exit_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('movements');
    }
};
