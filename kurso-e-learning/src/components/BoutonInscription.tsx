import { sInscrire, seDesinscrire, estInscrit } from "@/actions/inscription.actions";

export async function BoutonInscription({ coursId }: { coursId: string }) {

    const inscription = await estInscrit(coursId);

    if (inscription) {
        return (
            <form action={seDesinscrire} className="flex items-center gap-3">
                <input type="hidden" name="inscriptionId" value={inscription.id} />
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                    Inscrit
                </span>
                <button type="submit" className="text-sm text-slate-500 underline hover:text-red-600">
                    Se désinscrire
                </button>
            </form>
        );
    }

    return (
        <form action={sInscrire}>
            <input type="hidden" name="coursId" value={coursId} />
            <button type="submit" className="rounded-lg bg-purple-600 px-5 py-3 font-semibold text-white hover:bg-purple-700">
                S&apos;inscrire à ce cours
            </button>
        </form>
    );
}