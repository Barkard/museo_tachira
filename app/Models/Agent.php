<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Agent extends Model
{
    protected $fillable = [
        'name_legal_entity',
        'agent_type', 
        'representative_name',
        'email',
        'phone',
        'address'
    ];

    public function movements()
    {
        return $this->hasMany(Movement::class);
    }
}