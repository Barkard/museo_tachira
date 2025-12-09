<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class SchemaVerificationSeeder extends Seeder
{
    public function run()
    {
        // 1. Dependencies
        $rolId = DB::table('rols')->insertGetId([
            'nombre_rol' => 'Admin',
            'descripcion' => 'Administrador del sistema',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $ubicacionId = DB::table('categoria_ubicacions')->insertGetId([
            'nombre_ubicacion' => 'Depósito A',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $clasificacionId = DB::table('categoria_clasificacions')->insertGetId([
            'nombre_clasificacion' => 'Pintura',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $agenteId = DB::table('agentes')->insertGetId([
            'nombre_razon_social' => 'Juan Pérez',
            'tipo_agente' => 'Donante',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $movimientoTipoId = DB::table('cat_movimientos')->insertGetId([
            'nombre_movimiento' => 'Ingreso',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $estadoTramiteId = DB::table('cat_estado_tramites')->insertGetId([
            'estado' => 'Finalizado',
            'descripcion' => 'Tramite completado',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 2. Level 1 dependents
        $usuarioId = DB::table('usuarios')->insertGetId([
            'id_rol' => $rolId,
            'nombre' => 'Admin',
            'apellido' => 'User',
            'cedula' => 12345678,
            'email' => 'admin@museo.com',
            'contrasena' => Hash::make('password'),
            'fecha_nacimiento' => '1990-01-01',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $movimientoId = DB::table('movimientos')->insertGetId([
            'tipo_movimiento_FK' => $movimientoTipoId,
            'agente_id_FK' => $agenteId,
            'estado_tramite_FK' => $estadoTramiteId,
            'usuario_id_FK' => $usuarioId,
            'fecha_ingreso_egreso' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 3. Level 2 dependents
        $piezaId = 'PIEZA-001';
        DB::table('piezas')->insert([
            'pieza_id' => $piezaId,
            'clasificacion_id_FK' => $clasificacionId,
            'movimiento_id_FK' => $movimientoId,
            'numero_registro' => 'REG-001',
            'nombre_pieza' => 'Mona Lisa Copy',
            'descripcion' => 'Una copia',
            'autor_etnia' => 'Desconocido',
            'dimensiones' => '50x50',
            'fecha_realizacion' => '2023',
            'historia_breve' => 'N/A',
            'valor_referencial' => 100.00,
            'es_pieza_investigacion' => false,
            'referencia_fotografica' => 'path/to/img.jpg',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 4. Level 3 dependents
        DB::table('contexto_piezas')->insert([
            'contexto_id' => 1,
            'pieza_id_FK' => $piezaId,
            'lugar_procedencia' => 'Italia',
            'referencias_bibliograficas' => 'Libro X',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('estado_conservacions')->insert([
            'pieza_id_FK' => $piezaId,
            'usuario_id_FK' => $usuarioId,
            'fecha_evaluacion' => now(),
            'estado_detalle' => 'Bueno',
            'intervencion_aplicada' => 'Limpieza',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('localizacion_actuals')->insert([
            'pieza_id_FK' => $piezaId,
            'ubicacion_id_FK' => $ubicacionId,
            'usuario_id_FK' => $usuarioId,
            'fecha_movimiento' => now(),
            'motivo_movimiento' => 'Almacenamiento',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->command->info('Schema verification seeder ran successfully!');
    }
}
