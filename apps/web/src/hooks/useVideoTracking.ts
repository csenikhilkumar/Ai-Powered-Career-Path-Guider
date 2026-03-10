import { useEffect, useState } from 'react';

export const VIDEO_TRACK_EVENT = 'video_tracking_update';

export function useVideoTracking() {
    const [extraHours, setExtraHours] = useState(0);

    const updateExtraHours = () => {
        const saved = localStorage.getItem('extraLearningSeconds');
        if (saved) {
            setExtraHours(parseFloat(saved) / 3600);
        }
    };

    useEffect(() => {
        updateExtraHours();

        const handleFocusOrVisible = () => {
            if (document.visibilityState !== 'visible' && !document.hasFocus()) return;

            const start = localStorage.getItem('videoStartTime');
            if (start) {
                const elapsedSeconds = (Date.now() - parseInt(start, 10)) / 1000;

                // Cap to 3 hours to prevent infinite tracking if tab is left open
                const validSeconds = Math.min(elapsedSeconds, 10800);

                // Only count if they were away for at least 15 seconds
                if (validSeconds > 15) {
                    const currentSaved = parseFloat(localStorage.getItem('extraLearningSeconds') || '0');
                    const newTotal = currentSaved + validSeconds;

                    localStorage.setItem('extraLearningSeconds', newTotal.toString());
                }

                localStorage.removeItem('videoStartTime');

                updateExtraHours();
                window.dispatchEvent(new Event(VIDEO_TRACK_EVENT));
            }
        };

        const onVisibilityChange = () => {
            handleFocusOrVisible();
        };

        const onFocus = () => {
            handleFocusOrVisible();
        };

        const onCustomEvent = () => updateExtraHours();

        document.addEventListener('visibilitychange', onVisibilityChange);
        window.addEventListener('focus', onFocus);
        window.addEventListener(VIDEO_TRACK_EVENT, onCustomEvent);

        return () => {
            document.removeEventListener('visibilitychange', onVisibilityChange);
            window.removeEventListener('focus', onFocus);
            window.removeEventListener(VIDEO_TRACK_EVENT, onCustomEvent);
        };
    }, []);

    const startWatching = (url: string) => {
        localStorage.setItem('videoStartTime', Date.now().toString());
        window.open(url, '_blank');
    };

    return { extraHours, startWatching };
}
