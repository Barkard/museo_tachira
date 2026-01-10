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
        DB::statement('ALTER TABLE pieces ALTER COLUMN dimensions TYPE json USING dimensions::json');
        DB::statement("ALTER TABLE pieces ALTER COLUMN dimensions SET DEFAULT '[]'::json");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pieces', function (Blueprint $table) {
            $table->string('dimensions')->change();
        });
    }
};
