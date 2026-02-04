<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('piece_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('piece_id')->constrained('pieces')->onDelete('cascade');
            $table->string('path'); // Aquí se guarda la ruta de la imagen
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('piece_images');
    }
};