<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\CurrentLocation;

class LocationCategory extends Model
{
    protected $fillable = [
        'location_name',
    ];

    public function currentLocations()
    {
        return $this->hasMany(CurrentLocation::class, 'location_id');
    }
}
