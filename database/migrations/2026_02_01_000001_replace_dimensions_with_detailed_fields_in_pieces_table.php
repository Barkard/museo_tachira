<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pieces', function (Blueprint $table) {
            $table->dropColumn('dimensions');
            $table->decimal('height', 10, 2)->nullable()->comment('Alto (cm)');
            $table->decimal('width', 10, 2)->nullable()->comment('Ancho (cm)');
            $table->decimal('depth', 10, 2)->nullable()->comment('Profundidad (cm)');
        });
    }

    public function down(): void
    {
        Schema::table('pieces', function (Blueprint $table) {
            $table->dropColumn(['height', 'width', 'depth']);
            $table->string('dimensions')->nullable();
        });
    }
};
