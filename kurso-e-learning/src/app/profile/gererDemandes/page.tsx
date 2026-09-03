import { getCurrentUser } from "@/actions/user.actions";
import { accepterDemande, refuserDemande } from "@/actions/profil.actions";
import prisma from "@/lib/prisma";

export default async function GererDemandesPage() {

    const utilisateur = await getCurrentUser();
    if (!utilisateur) {
        return (
            <main className="max-w-5xl mx-auto p-8">
                <h1 className="text-3xl font-bold text-slate-900">
                    Gérer les demandes
                </h1>

                <p className="mt-4 text-slate-500">
                    Vous devez être connecté.
                </p>
            </main>
        );
    }

    if (utilisateur.role !== "ADMIN") {
        return (
            <main className="max-w-5xl mx-auto p-8">
                <p className="mt-4 text-slate-500">
                    Cette page est réservée aux administrateurs.
                </p>
            </main>
        );
    }

    const demandes = await prisma.demandeFormateur.findMany({
        include: {
            utilisateur: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <main className="min-h-screen bg-slate-50">
            <div className="max-w-5xl mx-auto p-8">

                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-900">
                        Gérer les demandes
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Consulte les demandes des étudiants qui souhaitent
                        devenir formateurs.
                    </p>
                </div>

                {demandes.length === 0 ? (
                    <div className="bg-white border border-slate-200 rounded-2xl p-6">
                        <p className="text-slate-500">
                            Aucune demande pour le moment.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {demandes.map((demande) => (
                            <div key={demande.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                                <div className="flex items-start justify-between gap-4">

                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900">
                                            {demande.utilisateur.nom}
                                        </h2>

                                        <p className="text-sm text-slate-500 mt-1">
                                            {demande.utilisateur.email}
                                        </p>
                                    </div>

                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            demande.statut === "EN_ATTENTE"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : demande.statut === "ACCEPTEE"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                        }`}>
                                        {demande.statut}
                                    </span>

                                </div>

                                <div className="mt-6">
                                    <p className="text-sm font-semibold text-purple-600">
                                        Expertise
                                    </p>

                                    <p className="mt-2 text-slate-700">
                                        {demande.expertise}
                                    </p>
                                </div>

                                <div className="mt-5">
                                    <p className="text-sm font-semibold text-purple-600">
                                        Motivation
                                    </p>

                                    <p className="mt-2 text-slate-700 whitespace-pre-line">
                                        {demande.motivation}
                                    </p>
                                </div>

                                {demande.statut === "EN_ATTENTE" && (
                                    <div className="flex gap-3 mt-6">
                                        <form action={accepterDemande}>
                                            <input
                                                type="hidden"
                                                name="demandeId"
                                                value={demande.id}
                                            />

                                            <button
                                                type="submit"
                                                className="bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-3 rounded-lg transition"
                                            >
                                                Accepter
                                            </button>
                                        </form>

                                        <form action={refuserDemande}>
                                            <input
                                                type="hidden"
                                                name="demandeId"
                                                value={demande.id}
                                            />

                                            <button
                                                type="submit"
                                                className="bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-3 rounded-lg transition"
                                            >
                                                Refuser
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </main>
    );
}

