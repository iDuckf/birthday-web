import { useCallback, useEffect, useRef, useState } from "react";

const memories = Array.from({ length: 12 }, (_, i) => ({
    src: `/img/Memories_${i + 1}.png`,
    alt: `Memory photo ${i + 1}`,
}));

export default function MemoriesModal({ onClose }) {
    const [index, setIndex] = useState(0);
    const [playing, setPlaying] = useState(true);
    const closeButtonRef = useRef(null);
    const touchStartX = useRef(null);

    const showNext = useCallback(() => {
        setIndex((current) => (current + 1) % memories.length);
    }, []);

    const showPrev = useCallback(() => {
        setIndex(
            (current) => (current - 1 + memories.length) % memories.length,
        );
    }, []);

    useEffect(() => {
        closeButtonRef.current?.focus();

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const handleKeyDown = (event) => {
            if (event.key === "Escape") onClose();
            if (event.key === "ArrowRight") {
                event.preventDefault();
                showNext();
            }
            if (event.key === "ArrowLeft") {
                event.preventDefault();
                showPrev();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose, showNext, showPrev]);

    useEffect(() => {
        if (!playing) return;

        const timer = setInterval(showNext, 4500);
        return () => clearInterval(timer);
    }, [playing, index, showNext]);

    const handleTouchStart = (event) => {
        touchStartX.current = event.touches[0].clientX;
    };

    const handleTouchEnd = (event) => {
        if (touchStartX.current === null) return;

        const distance = event.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(distance) > 40) {
            if (distance > 0) showPrev();
            else showNext();
        }
        touchStartX.current = null;
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#2A0B3D]/65 p-3 backdrop-blur-sm sm:p-6"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="memories-title"
                className="relative flex max-h-[94dvh] w-full max-w-3xl flex-col rounded-[1.75rem] border-2 border-[#F3D8FF] bg-[#FFF8FF] p-3 shadow-[0_24px_80px_rgba(64,14,96,0.35)] sm:max-w-4xl sm:rounded-[2.25rem] sm:p-5 lg:max-w-5xl lg:p-6"
            >
                <i className="fa-solid fa-heart pointer-events-none absolute -top-3 left-6 hidden text-2xl text-[#FFACCC] sm:block lg:left-10 lg:text-3xl"></i>
                <i className="fa-solid fa-heart pointer-events-none absolute -top-2 right-8 hidden text-xl text-[#F3B7D8] sm:block lg:right-12 lg:text-2xl"></i>

                <div className="flex shrink-0 items-center justify-between gap-2 pb-2 sm:pb-3">
                    <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#FADDFD] to-[#EFB9FD] shadow-md sm:h-11 sm:w-11 lg:h-12 lg:w-12">
                            <i className="fa-solid fa-camera text-base text-[#60098D] sm:text-xl lg:text-2xl"></i>
                        </div>
                        <div className="min-w-0">
                            <h2
                                id="memories-title"
                                className="truncate font-knewave text-sm text-[#5A2A6D] sm:text-lg lg:text-2xl"
                            >
                                Our Little Memories
                            </h2>
                            <p className="truncate font-roboto text-[10px] font-bold text-[#9976AE] sm:text-xs lg:text-sm">
                                A collection of our moments
                            </p>
                        </div>
                    </div>

                    <button
                        ref={closeButtonRef}
                        type="button"
                        aria-label="Close memories"
                        onClick={onClose}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[#F3B7D8] bg-white text-[#9C3E7A] shadow-sm transition hover:scale-110 hover:bg-[#FFF0F8] sm:h-10 sm:w-10"
                    >
                        <i className="fa-solid fa-xmark text-base sm:text-lg"></i>
                    </button>
                </div>

                <div
                    className="relative flex min-h-0 flex-1 items-center justify-center rounded-2xl bg-linear-to-br from-[#FDECF8] to-[#EFE0FF] p-2 sm:rounded-3xl sm:p-3 lg:p-4"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    <img
                        key={memories[index].src}
                        src={memories[index].src}
                        alt={memories[index].alt}
                        draggable={false}
                        className="max-h-[45dvh] w-auto max-w-full rounded-xl object-contain shadow-lg animate-memory-in motion-reduce:animate-none sm:max-h-[52dvh] sm:rounded-2xl lg:max-h-[58dvh]"
                    />

                    <button
                        type="button"
                        aria-label="Previous photo"
                        onClick={showPrev}
                        className="absolute left-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#F3B7D8] bg-white/90 text-[#9C3E7A] shadow-md transition hover:scale-110 sm:left-3 sm:h-11 sm:w-11"
                    >
                        <i className="fa-solid fa-chevron-left text-sm sm:text-base"></i>
                    </button>
                    <button
                        type="button"
                        aria-label="Next photo"
                        onClick={showNext}
                        className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#F3B7D8] bg-white/90 text-[#9C3E7A] shadow-md transition hover:scale-110 sm:right-3 sm:h-11 sm:w-11"
                    >
                        <i className="fa-solid fa-chevron-right text-sm sm:text-base"></i>
                    </button>

                    <button
                        type="button"
                        aria-label={
                            playing ? "Pause slideshow" : "Play slideshow"
                        }
                        onClick={() => setPlaying((current) => !current)}
                        className="absolute bottom-2 left-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#5A2A6D]/80 text-white shadow-md transition hover:scale-110 sm:bottom-3 sm:left-3 sm:h-9 sm:w-9"
                    >
                        <i
                            className={`fa-solid ${playing ? "fa-pause" : "fa-play"} text-xs sm:text-sm`}
                        ></i>
                    </button>

                    <span className="absolute bottom-2 right-2 rounded-full bg-[#5A2A6D]/80 px-2.5 py-1 font-roboto text-[10px] font-bold text-white shadow-md sm:bottom-3 sm:right-3 sm:text-xs">
                        {index + 1} / {memories.length}
                    </span>
                </div>

                <div className="flex shrink-0 flex-wrap items-center justify-center gap-1.5 pt-3 sm:gap-2 sm:pt-4">
                    {memories.map((memory, i) => (
                        <button
                            key={memory.src}
                            type="button"
                            aria-label={`Show ${memory.alt}`}
                            aria-current={i === index}
                            onClick={() => setIndex(i)}
                            className={`h-1.5 rounded-full transition-all sm:h-2 ${
                                i === index
                                    ? "w-5 bg-[#E36198] sm:w-7"
                                    : "w-1.5 bg-[#D9B8EC] hover:bg-[#B98AD8] sm:w-2"
                            }`}
                        ></button>
                    ))}
                </div>

                <div className="hidden shrink-0 gap-2 overflow-x-auto pt-3 sm:flex lg:pt-4">
                    {memories.map((memory, i) => (
                        <button
                            key={memory.src}
                            type="button"
                            aria-label={`Show ${memory.alt}`}
                            onClick={() => setIndex(i)}
                            className={`h-12 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition sm:h-14 sm:w-20 lg:h-16 lg:w-24 ${
                                i === index
                                    ? "border-[#E36198] shadow-md"
                                    : "border-transparent opacity-70 hover:opacity-100"
                            }`}
                        >
                            <img
                                src={memory.src}
                                alt=""
                                loading="lazy"
                                draggable={false}
                                className="h-full w-full object-cover"
                            />
                        </button>
                    ))}
                </div>

                <p className="shrink-0 pt-2 text-center font-roboto text-[10px] text-[#9976AE] sm:text-xs">
                    Use the arrows, dots or swipe to explore ✨
                </p>
            </div>
        </div>
    );
}
