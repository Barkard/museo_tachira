<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
        ]);

        $adminRole = \App\Models\Role::where('role_name', 'Admin')->first();

        User::firstOrCreate(
            ['email' => 'biscochogay@gmail.com'],
            [
                'role_id'=> $adminRole->id,
                'first_name' => 'biscocho',
                'last_name' => 'gay',
                'document_id' => '12345678',
                'password' => '12345678',
                'birth_date' => '2000-01-01',
                'email_verified_at' => now(),
            ]
        );
    }
}
