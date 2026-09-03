import { getCurrentUser } from "@/actions/user.actions";
import { demanderFormateur } from "@/actions/profil.actions";

export default async function DemandeFormateurPage() {
    const utilisateur = await getCurrentUser();

    if (!utilisateur) {
        return (
            <main className="max-w-3xl mx-auto p-8">
                <h1 className="text-3xl font-bold text-slate-900">
                    Demande formateur
                </h1>

                <p className="text-slate-500 mt-2">
                    Vous devez être connecté.
                </p>
            </main>
        );
    }

    return (
        <main className="max-w-3xl mx-auto p-8">

            <h1 className="text-3xl font-bold text-slate-900">
                Devenir formateur
            </h1>

            <p className="text-slate-500 mt-2 mb-8">
                Présente-nous tes compétences afin de faire une demande
                pour devenir formateur.
            </p>

            <form action={demanderFormateur} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

                <div className="mb-5">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Ton expertise
                    </label>

                    <input type="text" name="expertise" placeholder="Ex : Développement web"
                        className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-purple-500 text-slate-900" required/>
                </div>

                <div className="mb-5">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Pourquoi veux-tu devenir formateur ?
                    </label>
                    <textarea name="motivation" placeholder="Explique ta motivation..." rows={5}
                        className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-purple-500 text-slate-900" required/>
                </div>

                <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-5 py-3 rounded-lg transition">
                    Envoyer la demande
                </button>
            </form>

        </main>
    );
}

