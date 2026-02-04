<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PieceImage extends Model
{
    protected $fillable = ['piece_id', 'path'];

    // Relación inversa: Una imagen pertenece a una pieza
    public function piece()
    {
        return $this->belongsTo(Piece::class);
    }
}