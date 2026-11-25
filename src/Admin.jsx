import "./tailwind.css";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";

export default function Admin() {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
            setLoading(false);
        });

        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => setSession(session),
        );

        return () => listener.subscription.unsubscribe();
    }, []);

    return (
        <div className="min-h-screen bg-[#F9F0FF] px-4 py-8 sm:px-6">
            {loading ? (
                <p className="text-center font-roboto text-[#7340A4]">
                    Loading...
                </p>
            ) : session ? (
                <WishList />
            ) : (
                <Login />
            )}
        </div>
    );
}

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) setError(error.message);
        setSubmitting(false);
    };

    return (
        <form
            onSubmit={handleLogin}
            className="mx-auto mt-16 flex w-full max-w-sm flex-col gap-4 rounded-3xl bg-white p-6 shadow-2xl"
        >
            <h1 className="text-center font-knewave text-3xl text-[#5A2A6D]">
                Admin Login
            </h1>

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-xl border-2 border-dashed border-[#A682C6] p-3 text-[#5A2A6D] focus:outline-none"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-xl border-2 border-dashed border-[#A682C6] p-3 text-[#5A2A6D] focus:outline-none"
            />

            <button
                type="submit"
                disabled={submitting}
                className="h-12 rounded-full bg-linear-to-b from-[#F978B7] to-[#EA1A8D] font-bold text-[#FFF6F6] disabled:opacity-60"
            >
                {submitting ? "Logging in..." : "Login"}
            </button>

            {error && (
                <p className="text-center font-roboto text-sm text-red-500">
                    {error}
                </p>
            )}
        </form>
    );
}

function WishList() {
    const [wishes, setWishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Dipakai oleh tombol Refresh (dipanggil dari event handler, jadi aman)
    const fetchWishes = async () => {
        setLoading(true);
        setError("");

        const { data, error } = await supabase
            .from("wishes")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) setError(error.message);
        else setWishes(data);

        setLoading(false);
    };

    // Load awal: setState hanya dipanggil SETELAH await (asynchronous)
    useEffect(() => {
        let ignore = false;

        const load = async () => {
            const { data, error } = await supabase
                .from("wishes")
                .select("*")
                .order("created_at", { ascending: false });

            if (ignore) return;

            if (error) setError(error.message);
            else setWishes(data);

            setLoading(false);
        };

        load();

        return () => {
            ignore = true;
        };
    }, []);

    const handleDelete = async (id) => {
        if (!confirm("Hapus wish ini?")) return;

        const { error } = await supabase.from("wishes").delete().eq("id", id);

        if (error) alert(error.message);
        else setWishes((prev) => prev.filter((w) => w.id !== id));
    };

    return (
        <div className="mx-auto w-full max-w-3xl">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <h1 className="font-knewave text-3xl text-[#5A2A6D]">
                    All Wishes{" "}
                    <span className="text-[#E36198]">({wishes.length})</span>
                </h1>

                <div className="flex gap-2">
                    <button
                        onClick={fetchWishes}
                        className="rounded-full border-2 border-[#B091E2] px-4 py-2 text-sm font-bold text-[#7340A4]"
                    >
                        <i className="fa-solid fa-rotate"></i> Refresh
                    </button>
                    <button
                        onClick={() => supabase.auth.signOut()}
                        className="rounded-full bg-[#7340A4] px-4 py-2 text-sm font-bold text-white"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {error && <p className="mb-4 text-center text-red-500">{error}</p>}

            {loading ? (
                <p className="text-center font-roboto text-[#7340A4]">
                    Loading wishes...
                </p>
            ) : wishes.length === 0 ? (
                <p className="text-center font-roboto text-[#7340A4]">
                    Belum ada wish 🎂
                </p>
            ) : (
                <div className="flex flex-col gap-4">
                    {wishes.map((w) => (
                        <div
                            key={w.id}
                            className="rounded-2xl bg-white p-5 shadow-lg"
                        >
                            <div className="mb-2 flex items-start justify-between gap-3">
                                <div>
                                    <p className="font-roboto font-bold text-[#5A2A6D]">
                                        {w.name || "Anonymous"}
                                    </p>
                                    <p className="font-roboto text-xs text-[#9976AE]">
                                        {new Date(w.created_at).toLocaleString(
                                            "id-ID",
                                        )}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDelete(w.id)}
                                    className="text-sm font-bold text-red-400 hover:text-red-600"
                                >
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </div>

                            <p className="whitespace-pre-wrap wrap-break-word font-roboto text-[#321060]">
                                {w.message}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
