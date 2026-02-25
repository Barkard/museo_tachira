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
        Schema::table('movements', function (Blueprint $table) {
            $table->dropForeign(['transaction_status_id']);
            $table->dropColumn('transaction_status_id');
            $table->boolean('transaction_status')->default(true)->after('agent_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('movements', function (Blueprint $table) {
            $table->dropColumn('transaction_status');
            $table->foreignId('transaction_status_id')->nullable()->constrained('transaction_status_catalogs')->after('agent_id');
        });
    }
};
