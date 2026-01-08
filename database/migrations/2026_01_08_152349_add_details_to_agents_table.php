<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('agents', function (Blueprint $table) {
            $table->string('representative_name')->nullable()->after('name_legal_entity'); 
            $table->string('email')->nullable()->after('agent_type');
            $table->string('phone')->nullable()->after('email');
            $table->text('address')->nullable()->after('phone');
        });
    }

    public function down(): void
    {
        Schema::table('agents', function (Blueprint $table) {
            $table->dropColumn(['representative_name', 'email', 'phone', 'address']);
        });
    }
};