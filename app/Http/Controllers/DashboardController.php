<?php

namespace App\Http\Controllers;

use App\Models\Piece;
use App\Models\LocationCategory;
use App\Models\Movement;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'pieces'    => Piece::count(),
            'locations' => LocationCategory::count(),
            'users'     => User::count(),
            'movements' => Movement::whereDate('created_at', now())->count(),
        ];

        $movements = Movement::with(['piece', 'user'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($m) {
                $userName = $m->user ? ($m->user->first_name . ' ' . $m->user->last_name) : 'Sistema';
                
                return [
                    'id' => 'mov-' . $m->id, 
                    'sort_date' => $m->created_at,
                    'action' => $m->type ?? 'Movimiento',
                    'detail' => $m->piece ? $m->piece->piece_name : 'Pieza desconocida', 
                    'user' => trim($userName),
                    'time' => $m->created_at->diffForHumans(),
                ];
            });

        $pieces = Piece::latest()
            ->take(5)
            ->get()
            ->map(function ($p) {
                return [
                    'id' => 'pie-' . $p->id, 
                    'sort_date' => $p->created_at,
                    'action' => 'REGISTRO', 
                    'detail' => $p->piece_name, 
                    'user' => 'Inventario', 
                    'time' => $p->created_at->diffForHumans(),
                ];
            });


        $recentActivity = $movements->concat($pieces)
            ->sortByDesc('sort_date')
            ->take(5) 
            ->values(); 

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recentActivity' => $recentActivity
        ]);
    }
}