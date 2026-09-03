import Link from "next/link";
import { getCurrentUser } from "@/actions/user.actions";
import { getMesInscriptions, seDesinscrire } from "@/actions/inscription.actions";

export default async function ProfilePage({
    searchParams,
}: {
    searchParams: Promise<{ statut?: string; page?: string }>;
}) {

    // à voir avec toleen
    const params = await searchParams;
    const statut = params.statut;
    const page = Number(params.page) || 1;

    const utilisateur = await getCurrentUser();
    if (!utilisateur) {
        return (
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-2xl font-bold">Mon profil</h1>
                <p className="mt-4 text-slate-600">Connecte-toi pour voir tes cours.</p>
            </div>
        );
    }

    const data = await getMesInscriptions(statut, page);
    if (!data) return null;

    return (
        <div className="container mx-auto px-4 py-10">

            <h1 className="text-3xl font-bold">{utilisateur.nom}</h1>
            <p className="text-slate-500">{utilisateur.email} · {utilisateur.role}</p>

            <h2 className="mt-8 text-xl font-semibold">
                Mes cours inscrits ({data.total})
            </h2>

            {/* Filtre */}
            <div className="mt-4 flex gap-2">
                <Link href="/profile" className="rounded-full bg-slate-200 px-3 py-1 text-sm hover:bg-slate-300">
                    Tous
                </Link>
                <Link href="/profile?statut=EN_COURS" className="rounded-full bg-slate-200 px-3 py-1 text-sm hover:bg-slate-300">
                    En cours
                </Link>
                <Link href="/profile?statut=TERMINE" className="rounded-full bg-slate-200 px-3 py-1 text-sm hover:bg-slate-300">
                    Terminés
                </Link>
            </div>

            {/* Liste des inscription */}
            {data.inscriptions.length === 0 ? (
                <p className="mt-8 text-slate-500">Aucun cours dans cette catégorie.</p>
            ) : (
                <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                    {data.inscriptions.map((inscription) => (
                        <li key={inscription.id} className="rounded-lg border border-slate-200 bg-white p-5">

                            <Link href={`/cours/${inscription.coursId}`} className="font-semibold hover:text-purple-600">
                                {inscription.cours.titre}
                            </Link>

                            <p className="mt-1 text-sm text-slate-500">
                                {inscription.cours.formateur.nom} · {inscription.cours.lecons.length} leçon(s)
                            </p>

                            {/* Barre de progression */}
                            <div className="mt-4">
                                <p className="mb-1 text-xs text-slate-500">
                                    Progression : {inscription.progression}% ({inscription.statut})
                                </p>
                                <div className="h-2 w-full rounded-full bg-slate-200">
                                    <div
                                        className="h-2 rounded-full bg-purple-600"
                                        style={{ width: `${inscription.progression}%` }}
                                    />
                                </div>
                            </div>

                            {/* Se désinscrire */}
                            <form action={seDesinscrire} className="mt-4">
                                <input type="hidden" name="inscriptionId" value={inscription.id} />
                                <button type="submit" className="text-sm text-slate-500 underline hover:text-red-600">
                                    Se désinscrire
                                </button>
                            </form>

                        </li>
                    ))}
                </ul>
            )}

            {/* Pagination */}
            {data.pages > 1 && (
                <div className="mt-8 flex gap-2">
                    {Array.from({ length: data.pages }).map((_, i) => (
                        <Link
                            key={i}
                            href={statut ? `/profile?statut=${statut}&page=${i + 1}` : `/profile?page=${i + 1}`}
                            className="rounded bg-slate-200 px-3 py-1 text-sm hover:bg-slate-300"
                        >
                            {i + 1}
                        </Link>
                    ))}
                </div>
            )}

        </div>
    );
}