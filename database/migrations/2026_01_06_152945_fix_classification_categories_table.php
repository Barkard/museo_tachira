<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('classification_categories', function (Blueprint $table) {
            DB::statement('ALTER TABLE classification_categories RENAME COLUMN classification_name TO name');
            
            $table->text('description')->nullable()->after('classification_name'); 
        });
    }

    public function down(): void
    {
        Schema::table('classification_categories', function (Blueprint $table) {
            $table->renameColumn('name', 'classification_name');
            $table->dropColumn('description');
        });
    }
};