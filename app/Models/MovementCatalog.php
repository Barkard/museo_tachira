<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Movement;

class MovementCatalog extends Model
{
    protected $fillable = [
        'movement_name',
    ];

    public function movements()
    {
        return $this->hasMany(Movement::class, 'movement_type_id');
    }
}
