<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PieceContext extends Model
{
    protected $fillable = [
        'piece_id',
        'provenance_location',
        'bibliographic_references',
    ];

    public function piece()
    {
        return $this->belongsTo(Piece::class);
    }
}
