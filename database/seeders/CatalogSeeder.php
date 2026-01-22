<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CatalogSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Tipos de Movimiento 
        $types = [
            'Ingreso (Donación)',
            'Ingreso (Compra)',
            'Ingreso (Hallazgo)',
            'Salida (Préstamo Externo)',
            'Salida (Restauración)',
            'Traslado Interno',
            'Baja (Destrucción/Pérdida)'
        ];

        foreach ($types as $type) {
            DB::table('movement_catalogs')->insertOrIgnore([
                'movement_name' => $type,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // 2. Estados de la Transacción
        $statuses = [
            'Completado',
            'En Proceso',
            'Pendiente de Aprobación',
            'Cancelado'
        ];

        foreach ($statuses as $status) {
            DB::table('transaction_status_catalogs')->insertOrIgnore([
                'status' => $status,
                'description' => "El trámite se encuentra en estado: $status", 
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}