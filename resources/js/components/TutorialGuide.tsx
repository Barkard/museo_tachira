import React, { useEffect } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { HelpCircle } from 'lucide-react';


export interface TutorialStep {
    element: string;
    popover: {
        title: string;
        description: string;
        side?: 'left' | 'right' | 'top' | 'bottom';
        align?: 'start' | 'center' | 'end';
    };
}

interface Props {
    tutorialKey: string;
    steps: TutorialStep[];
}

export default function TutorialGuide({ tutorialKey, steps }: Props) {
    
    const driverObj = driver({
        showProgress: true,
        animate: true,
        steps: steps,
        nextBtnText: 'Siguiente',
        prevBtnText: 'Anterior',
        doneBtnText: 'Finalizar',
        allowClose: true,
    });

    useEffect(() => {
        // Verificar si el usuario ya vio el tutorial
        const hasSeenTutorial = localStorage.getItem(tutorialKey);

        if (!hasSeenTutorial) {
            // Si es la primera vez, iniciar automáticamente
            driverObj.drive();
            // Marcar como visto
            localStorage.setItem(tutorialKey, 'true');
        }
    }, [tutorialKey]);

    // Función para iniciar el tutorial manualmente
    const startTutorial = () => {
        driverObj.drive();
    };

    return (
        <button
            onClick={startTutorial}
            className="fixed bottom-6 right-6 z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all transform hover:scale-110 flex items-center gap-2 font-bold"
            title="Ver Tutorial de esta página"
        >
            <HelpCircle size={24} />
            <span className="hidden md:inline">Ayuda</span>
        </button>
    );
}