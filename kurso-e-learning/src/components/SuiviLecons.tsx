import { getProgressionCours, marquerLeconTerminee } from "@/actions/inscription.actions";

export async function SuiviLecons({ coursId }: { coursId: string }) {

    const data = await getProgressionCours(coursId);

    // en cas de pas inscrit ou pas connecté 
    if (!data) return null;

    return (
        <section className="rounded-lg border border-slate-200 bg-white p-6">

            <h2 className="text-lg font-semibold">Ma progression</h2>

            <p className="mt-1 text-sm text-slate-500">
                {data.inscription.progression}% — {data.inscription.statut}
            </p>

            <div className="mt-2 h-2 w-full rounded-full bg-slate-200">
                <div
                    className="h-2 rounded-full bg-purple-600"
                    style={{ width: `${data.inscription.progression}%` }}
                />
            </div>

            {data.lecons.length === 0 ? (
                <p className="mt-4 text-sm text-slate-500">Ce cours n&apos;a pas encore de leçon.</p>
            ) : (
                <ul className="mt-4">
                    {data.lecons.map((lecon) => (
                        <li key={lecon.id} className="flex items-center justify-between border-b border-slate-100 py-3">

                            <span className={lecon.terminee ? "text-slate-400 line-through" : ""}>
                                {lecon.titre}
                            </span>

                            {lecon.terminee ? (
                                <span className="text-sm text-green-600">Terminée</span>
                            ) : (
                                <form action={marquerLeconTerminee}>
                                    <input type="hidden" name="leconId" value={lecon.id} />
                                    <button type="submit" className="rounded bg-slate-200 px-3 py-1 text-sm hover:bg-slate-300">
                                        Marquer comme terminée
                                    </button>
                                </form>
                            )}

                        </li>
                    ))}
                </ul>
            )}

        </section>
    );
}