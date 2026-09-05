import Link from "next/link";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/actions/user.actions";

export default async function MesCoursCreesPage() {

    const utilisateur = await getCurrentUser();
    if (!utilisateur) {
        return (
            <main className="min-h-screen bg-slate-50 p-8">
                <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">

                    <h1 className="text-2xl font-bold text-slate-900">
                        Vous devez être connecté
                    </h1>

                    <p className="mt-3 text-slate-500">
                        Connectez-vous pour voir vos cours créés.
                    </p>
                    <Link href="/sign-in" className="mt-6 inline-block rounded-lg bg-purple-600 px-5 py-3 text-white transition hover:bg-purple-700">
                        Se connecter
                    </Link>
                </div>
            </main>
        );
    }

    //verifier si l'utilisateur est formateur ou admin
    if (utilisateur.role !== "FORMATEUR" && utilisateur.role !== "ADMIN") {
        return (
            <main className="min-h-screen bg-slate-50 p-8">
                <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <h1 className="text-2xl font-bold text-red-600">
                        Accès refusé
                    </h1>
                    <p className="mt-3 text-slate-500">
                        Seuls les formateurs peuvent gérer leurs cours.
                    </p>
                    <Link href="/profil" className="mt-6 inline-block rounded-lg bg-purple-600 px-5 py-3 text-white transition hover:bg-purple-700">
                        Retour au profil
                    </Link>
                </div>
            </main>
        );
    }


    const cours = await prisma.cours.findMany({
        where: {
            formateurId: utilisateur.id,
        },
        include: {
            lecons: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <main className="min-h-screen bg-slate-50 py-12">
            <div className="mx-auto max-w-6xl px-4">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                        <Link href="/profil" className="text-sm font-medium text-purple-600">
                            ← Retour au profil
                        </Link>

                        <h1 className="mt-4 text-4xl font-bold text-slate-900">
                            Mes cours créés
                        </h1>

                        <p className="mt-2 text-slate-500">
                            Gérez les cours que vous avez créés.
                        </p>
                    </div>

                    <Link href="/cours" className="rounded-lg bg-purple-600 px-5 py-3 font-medium text-white transition hover:bg-purple-700">
                        + Créer un cours
                    </Link>
                </div>


                <section className="mt-10">

                    {cours.length === 0 ? (
                        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">

                            <h2 className="text-xl font-bold text-slate-900">
                                Vous n'avez encore créé aucun cours
                            </h2>

                            <p className="mt-2 text-slate-500">
                                Commencez par créer votre premier cours.
                            </p>
                            <Link href="/cours/new" className="mt-6 inline-block rounded-lg bg-purple-600 px-5 py-3 font-medium text-white transition hover:bg-purple-700">
                                Créer mon premier cours
                            </Link>
                        </div>

                    ) : (

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                            {cours.map((cours) => (
                                <div key={cours.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
                                    <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                                        {cours.niveau}
                                    </span>

                                    <h2 className="mt-4 text-xl font-bold text-slate-900">
                                        {cours.titre}
                                    </h2>

                                    <p className="mt-2 line-clamp-3 text-sm text-slate-500">
                                        {cours.description}
                                    </p>
                                    <p className="mt-4 text-sm text-slate-500">
                                        {cours.lecons.length} leçon
                                        {cours.lecons.length > 1 ? "s" : ""}
                                    </p>

                                    <Link href={`/cours/${cours.id}`} 
                                        className="mt-6 block rounded-lg bg-slate-900 px-4 py-3 text-center font-medium text-white transition hover:bg-slate-800">
                                        Gérer le cours
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}

