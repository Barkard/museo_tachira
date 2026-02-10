<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Piece extends Model
{
    protected $fillable = [
        'classification_id',
        'registration_number',
        'piece_name',
        'description',
        'author_ethnicity',
        'height',
        'width',
        'depth',
        'realization_date',
        'brief_history',
        'is_research_piece',
        /* 'photograph_reference', */
    ];

    protected $casts = [
        'is_research_piece' => 'boolean',
    ];

    public function classification()
    {
        return $this->belongsTo(ClassificationCategory::class, 'classification_id');
    }

    public function acquisitionMovement()
    {
        return $this->belongsTo(Movement::class, 'movement_id');
    }

    public function context()
    {
        return $this->hasOne(PieceContext::class);
    }

    public function currentLocations()
    {
        return $this->hasMany(CurrentLocation::class);
    }

    public function conservationStatuses()
    {
        return $this->hasMany(ConservationStatus::class);
    }
    public function images()
    {
        return $this->hasMany(PieceImage::class);
    }
}
