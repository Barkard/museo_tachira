<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\CurrentLocation;

class LocationCategory extends Model
{
    protected $fillable = [
        'name',
        'description',
    ];

    public function currentLocations()
    {
        return $this->hasMany(CurrentLocation::class, 'location_id');
    }
}
