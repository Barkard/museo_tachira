<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CurrentLocation extends Model
{
    protected $fillable = [
        'piece_id',
        'location_id',
        'user_id',
        'movement_date',
        'movement_reason',
    ];

    public function piece()
    {
        return $this->belongsTo(Piece::class);
    }

    public function locationCategory()
    {
        return $this->belongsTo(LocationCategory::class, 'location_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
