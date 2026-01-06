<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\MovementCatalog;
use App\Models\Agent;
use App\Models\TransactionStatusCatalog;
use App\Models\User;

class Movement extends Model
{
    protected $fillable = [
        'movement_type_id',
        'agent_id',
        'transaction_status_id',
        'user_id',
        'entry_exit_date',
    ];
    
    public function piece()
    {
        return $this->hasOne(Piece::class, 'movement_id');
    }

    public function movementCatalog()
    {
        return $this->belongsTo(MovementCatalog::class, 'movement_type_id');
    }

    public function agent()
    {
        return $this->belongsTo(Agent::class);
    }

    public function transactionStatus()
    {
        return $this->belongsTo(TransactionStatusCatalog::class, 'transaction_status_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
