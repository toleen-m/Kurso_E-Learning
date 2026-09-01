import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
        <div className="container mx-auto px-4 py-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                <div>
                    <Link href="/" className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">🎓</span>

                    <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                        KURSO
                    </span>
                    </Link>

                    <p className="text-sm text-slate-400 max-w-sm">
                        Apprenez à votre rythme, développez vos compétences
                        et progressez avec Kurso.
                    </p>
                </div>

                <div>
                    <h3 className="text-white font-semibold mb-4">
                        Navigation
                    </h3>

                    <div className="flex flex-col gap-2">
                        <Link href="/" className="text-slate-400 hover:text-white transition">
                            Accueil
                        </Link>

                        <Link href="/cours" className="text-slate-400 hover:text-white transition">
                            Cours
                        </Link>

                        <Link href="/profile" className="text-slate-400 hover:text-white transition">
                            Mon profil
                        </Link>
                    </div>
                </div>

                <div>
                    <h3 className="text-white font-semibold mb-4">
                        Kurso
                    </h3>

                    <div className="flex flex-col gap-2">
                        <Link href="/about" className="text-slate-400 hover:text-white transition">
                            À propos
                        </Link>

                        <Link href="/contact" className="text-slate-400 hover:text-white transition">
                            Contact
                        </Link>
                    </div>
                </div>

            </div>

            <div className="border-t border-slate-800 mt-8 pt-6">
                <p className="text-sm text-slate-500 text-center">
                    © {new Date().getFullYear()} Kurso. Tous droits réservés.
                </p>
            </div>
        </div>
    </footer>
  );
}

