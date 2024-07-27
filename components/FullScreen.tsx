'use client';

import { useEffect, useState } from 'react';
import { Maximize, Minimize } from 'lucide-react';
import { Button } from './ui/button';

export default function FullScreenButton() {
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const handleFullscreenChange = () => {
            const fullscreenElement = document.fullscreenElement;
            setIsFullscreen(!!fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    const enterFullScreen = () => {
        const body = document.body;

        if (body.requestFullscreen) {
            body.requestFullscreen();
        } else if ((body as any).mozRequestFullScreen) { // Firefox
            (body as any).mozRequestFullScreen();
        } else if ((body as any).webkitRequestFullscreen) { // Chrome, Safari and Opera
            (body as any).webkitRequestFullscreen();
        } else if ((body as any).msRequestFullscreen) { // IE/Edge
            (body as any).msRequestFullscreen();
        }
    };

    const exitFullScreen = () => {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if ((document as any).mozCancelFullScreen) { // Firefox
            (document as any).mozCancelFullScreen();
        } else if ((document as any).webkitExitFullscreen) { // Chrome, Safari and Opera
            (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) { // IE/Edge
            (document as any).msExitFullscreen();
        }
    };

    return (
        <div>
            {isFullscreen ? (
                <Button onClick={exitFullScreen} size="icon" variant="outline">
                    <Minimize />
                </Button>
            ) : (
                <Button onClick={enterFullScreen} size="icon" variant="outline">
                    <Maximize />
                </Button>
            )}
        </div>
    );
}
