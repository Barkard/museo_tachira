<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClassificationCategory extends Model
{
    protected $fillable = [
        'classification_name',
    ];

    public function pieces()
    {
        return $this->hasMany(Piece::class, 'classification_id');
    }
}
