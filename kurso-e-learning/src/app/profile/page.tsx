import { getCurrentUser } from "@/actions/user.actions"
import Link from "next/link"

export default async function ProfilPage() {
  const user = await getCurrentUser()

  if (!user) {
    return (
      <main className="max-w-3xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4 text-slate-900">Mon profil</h1>
        <p className="text-slate-500">Connectez-vous pour accéder à votre profil.</p>
      </main>
    )
  }

  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-slate-900">Mon profil</h1>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-600 mb-5">Informations</h2>

        <div className="space-y-2">
          <p className="text-sm text-slate-500"><strong className="text-purple-600">Nom :</strong> {user.nom}</p>
          <p className="text-sm text-slate-500"><strong className="text-purple-600">Email :</strong> {user.email}</p>
          <p className="text-sm text-slate-500"><strong className="text-purple-600">Rôle :</strong> {user.role}</p>
        </div>
      </div>

      {user.role === "ETUDIANT" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-600 mb-5">Options étudiant</h2>

          <div className="space-y-3">
            <Link href="/cours" className="block text-purple-600 hover:underline">
              Voir mes cours
            </Link>

            <Link href="/quiz" className="block text-purple-600 hover:underline">
              Voir mes quiz
            </Link>

            <Link
              href="/demande-formateur"
              className="block text-purple-600 hover:underline"
            >
              Demander à devenir formateur
            </Link>
          </div>
        </div>
      )}

      {user.role === "FORMATEUR" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-600 mb-5">Options formateur</h2>

          <div className="space-y-3">
            <Link href="/cours" className="block text-purple-600 hover:underline">
              Mes cours créés
            </Link>

            <Link
              href="/cours"
              className="block text-purple-600 hover:underline"
            >
              Créer un cours
            </Link>
          </div>
        </div>
      )}

      {user.role === "ADMIN" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-600 mb-5">Administration</h2>

            <div className="space-y-3">
                <Link href="/cours" className="block text-purple-600 hover:underline">
                    Mes cours créés
                </Link>

                <Link
                    href="/cours"
                    className="block text-purple-600 hover:underline"
                >
                    Créer un cours
                </Link>

                <Link
                    href="/admin/demandes"
                    className="block text-purple-600 hover:underline"
                >
                    Gérer les demandes de formateur
                </Link>
            </div>
        </div>
      )}
    </main>
  )
}