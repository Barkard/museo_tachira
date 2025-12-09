<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransactionStatusCatalog extends Model
{
    protected $fillable = [
        'status',
        'description',
    ];

    public function movements()
    {
        return $this->hasMany(Movement::class, 'transaction_status_id');
    }
}
