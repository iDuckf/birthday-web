import "./tailwind.css";
import cakeImg from "./assets/Kue-Edited.png";
import { useState } from "react";
import { supabase } from "./lib/supabaseClient"; // sesuaikan path-nya

function App() {
    // ... di dalam komponen:
    const [wish, setWish] = useState("");
    const [status, setStatus] = useState("idle"); // idle | loading | success | error

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!wish.trim()) return;

        setStatus("loading");

        // Jangan pakai .select() di sini, karena anon tidak punya izin SELECT
        const { error } = await supabase
            .from("wishes")
            .insert({ message: wish.trim() });

        if (error) {
            console.error(error);
            setStatus("error");
        } else {
            setStatus("success");
            setWish("");
            setTimeout(() => setStatus("idle"), 5000); // pesan hilang setelah 5 detik
        }
    };

    return (
        <>
            <div className="min-h-screen bg-cover bg-center bg-no-repeat bg-mobile px-3 py-6 sm:px-6 sm:py-8 lg:bg-desktop lg:px-8">
                {/* HERO SESSION */}
                <div>
                    <div className="flex flex-col items-center gap-8 lg:flex-row lg:justify-center lg:gap-8 xl:gap-16">
                        {/* TITLE CONTAINER */}
                        <div className="w-full max-w-xl py-2 lg:max-w-lg xl:max-w-2xl xl:py-10">
                            <div className="flex items-center gap-2 rounded-full border-2 border-[#BC9DEA] bg-[#EFDEFC] p-2 sm:gap-4">
                                <i className="fa-solid fa-heart text-lg text-[#FFACCC] sm:text-xl lg:text-2xl shrink-0"></i>
                                <p className="text-center text-xs leading-tight font-bold font-roboto text-[#5A2A6D] sm:text-sm lg:text-base xl:text-lg">
                                    A special day for someone special
                                </p>
                                <i className="fa-regular fa-heart text-lg text-[#FFACCC] sm:text-xl lg:text-2xl shrink-0"></i>
                            </div>

                            <div className="py-2 text-center">
                                <h1 className="pb-2 font-knewave text-4xl leading-tight text-[#5A2A6D] sm:text-5xl md:text-6xl lg:text-7xl xl:pb-4 xl:text-9xl">
                                    Happy
                                </h1>
                                <h1 className="pt-2 font-knewave text-4xl leading-tight text-[#E36198] sm:text-5xl md:text-6xl lg:text-7xl xl:pt-4 xl:text-9xl">
                                    Birthday
                                </h1>
                            </div>

                            <div className="py-6 text-center xl:py-10">
                                <p className="text-sm font-bold font-roboto text-[#9976AE] sm:text-base xl:text-lg">
                                    Wishing you all the happiness, good health,
                                </p>
                                <p className="text-sm font-bold font-roboto text-[#9976AE] sm:text-base xl:text-lg">
                                    and success in everything you do.
                                </p>
                            </div>
                        </div>

                        {/* CAKE IMAGE */}
                        <div className="shrink-0">
                            <img
                                src={cakeImg}
                                alt="kue"
                                className="w-64 sm:w-80 lg:w-80 xl:w-96 2xl:w-120"
                            />
                        </div>
                    </div>

                    {/* MESSAGE CONTAINER */}
                    <div className="mt-8 flex justify-center sm:mt-10 lg:mt-0">
                        <div className="w-full max-w-xl xl:max-w-4xl">
                            <div className="flex w-full flex-col items-center justify-center rounded-2xl bg-[#F0DCFC] px-4 py-4 text-sm drop-shadow-2xl sm:px-6 lg:text-base xl:text-lg">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-r from-[#FADDFD] to-[#EFB9FD] shadow-lg sm:h-15 sm:w-15">
                                    <i className="fa-solid fa-envelope text-2xl text-[#60098D] sm:text-3xl"></i>
                                </div>

                                <h1 className="py-2 font-roboto font-bold text-[#321060]">
                                    A Little Message For You
                                </h1>

                                <i className="fa-solid fa-heart pb-2 text-xl text-[#FFACCC]"></i>

                                <p className="text-center font-roboto text-xs sm:text-sm xl:text-base">
                                    "May this special day bring you happiness,
                                </p>
                                <p className="text-center font-roboto text-xs sm:text-sm xl:text-base">
                                    good health, and all the success you
                                    deserve.
                                </p>
                                <p className="text-center font-roboto text-xs sm:text-sm xl:text-base">
                                    Keep smiling and enjoy your day!"
                                </p>

                                <i className="fa-solid fa-heart pt-2 text-xl text-[#FFACCC]"></i>

                                <p className="py-2 font-roboto">
                                    &mdash; Kaeriz &mdash;
                                </p>
                            </div>

                            <div className="flex justify-center items-center py-5">
                                <a
                                    href="#message"
                                    className="border-2 border-[#B091E2] py-2 px-2 rounded-full"
                                >
                                    <i className="fa-solid fa-chevron-down text-[#B091E2]"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MESSAGE WISH SESSION */}
                <div
                    id="message"
                    className="flex flex-col items-center gap-8 py-10 lg:flex-row lg:justify-center lg:gap-10"
                >
                    <div className="shrink-0">
                        <img
                            src={cakeImg}
                            alt="kue"
                            className="w-64 sm:w-80 lg:w-80 xl:w-96 2xl:w-120"
                        />
                    </div>

                    <div className="w-full max-w-xl rounded-3xl bg-[#F9F0FF] px-4 py-4 shadow-2xl sm:px-8 xl:max-w-2xl xl:px-10 2xl:max-w-3xl">
                        <div className="flex flex-col items-center justify-center gap-1 text-center sm:flex-row">
                            <h1 className="font-knewave text-2xl text-[#5A2A6D] sm:text-3xl">
                                Write Your
                            </h1>
                            <h1 className="font-knewave text-2xl text-[#E36198] sm:text-3xl">
                                Birthday Wish!
                            </h1>
                        </div>

                        <p className="py-3 text-center text-base font-bold font-roboto text-[#7340A4] sm:text-xl">
                            Share your special wish!
                        </p>

                        <form
                            action="#"
                            className="flex flex-col items-center gap-5 py-3"
                            onSubmit={handleSubmit}
                        >
                            <textarea
                                name="wish"
                                id="wish"
                                placeholder="Type your wish here..."
                                className="h-48 w-full rounded-xl border-2 border-dashed border-[#A682C6] p-2 text-[#A682C6] focus:outline-none sm:h-56 lg:h-64 xl:h-70"
                                value={wish}
                                onChange={(e) => setWish(e.target.value)}
                                maxLength={1000}
                                required
                            ></textarea>

                            <div className="w-full sm:w-auto">
                                <button
                                    type="submit"
                                    disabled={status === "loading"}
                                    className="h-14 w-full rounded-full bg-linear-to-b from-[#F978B7] to-[#EA1A8D] font-bold text-[#FFF6F6] sm:h-15 sm:w-70"
                                >
                                    <i className="fa-solid fa-paper-plane"></i>{" "}
                                    {status === "loading"
                                        ? "Sending..."
                                        : "Send My Wish"}
                                </button>
                            </div>

                            {status === "success" && (
                                <p className="text-center font-roboto font-bold text-[#7340A4]">
                                    Thank you! Your Wish Has Been Sent ❤️
                                </p>
                            )}
                            {status === "error" && (
                                <p className="text-center font-roboto font-bold text-red-500">
                                    Oops, something went wrong. Please try
                                    again.
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;
