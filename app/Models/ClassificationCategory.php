<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory; 
use Illuminate\Database\Eloquent\Model;

class ClassificationCategory extends Model
{
    use HasFactory;


    protected $fillable = [
        'name',
        'description'
    ];

    public function pieces()
    {
        return $this->hasMany(Piece::class, 'classification_id');
    }
}