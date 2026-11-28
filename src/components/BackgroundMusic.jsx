import { useEffect, useRef, useState } from "react";

const bgmSrc = "/audio/Happy%20Birthday%20(Piano%20Version).mp3";

export default function BackgroundMusic() {
    const audioRef = useRef(null);
    const [playing, setPlaying] = useState(false);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const stopTrying = () => {
            document.removeEventListener("pointerdown", startOnInteraction);
            document.removeEventListener("keydown", startOnInteraction);
        };

        const start = async () => {
            try {
                await audio.play();
                stopTrying();
            } catch {
                setPlaying(false);
            }
        };

        function startOnInteraction(event) {
            if (
                event.target instanceof Element &&
                event.target.closest("[data-bgm-toggle]")
            ) {
                return;
            }
            start();
        }

        start();
        document.addEventListener("pointerdown", startOnInteraction);
        document.addEventListener("keydown", startOnInteraction);

        return () => {
            stopTrying();
            audio.pause();
        };
    }, []);

    const toggleMusic = async () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (audio.paused) {
            try {
                await audio.play();
            } catch {
                setPlaying(false);
            }
        } else {
            audio.pause();
        }
    };

    const label = playing ? "Turn off music" : "Play music";

    return (
        <>
            <audio
                ref={audioRef}
                src={bgmSrc}
                loop
                preload="auto"
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
            />

            <button
                type="button"
                data-bgm-toggle
                aria-label={label}
                title={label}
                onClick={toggleMusic}
                className="fixed right-4 bottom-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/80 bg-linear-to-br from-[#F978B7] to-[#B34FD8] text-white shadow-lg transition hover:scale-110 sm:h-12 sm:w-12 lg:right-6 lg:bottom-6 lg:h-14 lg:w-14"
            >
                <i
                    className={`fa-solid ${playing ? "fa-volume-high" : "fa-volume-xmark"} text-base sm:text-lg lg:text-xl`}
                ></i>
            </button>
        </>
    );
}
