<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('movements', function (Blueprint $table) {
            $table->foreignId('piece_id')->nullable()->constrained('pieces')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('movements', function (Blueprint $table) {
            $table->dropForeign(['piece_id']);
            $table->dropColumn('piece_id');
        });
    }
};
