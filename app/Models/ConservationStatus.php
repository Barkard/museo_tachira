<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Piece;
use App\Models\User;

class ConservationStatus extends Model
{
    protected $fillable = [
        'piece_id',
        'user_id',
        'evaluation_date',
        'status_details',
        'applied_intervention',
    ];

    public function piece()
    {
        return $this->belongsTo(Piece::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
