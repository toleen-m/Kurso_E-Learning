import { getCurrentUser } from "@/actions/user.actions"
import Link from "next/link"

export default async function ProfilPage() {
  const user = await getCurrentUser()

  if (!user) {
    return (
      <main className="p-8">
        <h1 className="text-3xl font-bold mb-4">Mon profil</h1>
        <p>Connectez-vous pour accéder à votre profil.</p>
      </main>
    )
  }

  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Mon profil</h1>

      <div className="border rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Informations</h2>

        <div className="space-y-2">
          <p><strong>Nom :</strong> {user.nom}</p>
          <p><strong>Email :</strong> {user.email}</p>
          <p><strong>Rôle :</strong> {user.role}</p>
        </div>
      </div>

      {user.role === "ETUDIANT" && (
        <div className="border rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Options étudiant</h2>

          <div className="space-y-3">
            <Link href="/cours" className="block text-blue-600 hover:underline">
              Voir mes cours
            </Link>

            <Link
              href="/demande-formateur"
              className="block text-blue-600 hover:underline"
            >
              Demander à devenir formateur
            </Link>
          </div>
        </div>
      )}

      {user.role === "FORMATEUR" && (
        <div className="border rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Options formateur</h2>

          <div className="space-y-3">
            <Link href="/cours" className="block text-blue-600 hover:underline">
              Mes cours créés
            </Link>

            <Link
              href="/newCours"
              className="block text-blue-600 hover:underline"
            >
              Créer un cours
            </Link>
          </div>
        </div>
      )}

      {user.role === "ADMIN" && (
        <div className="border rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Administration</h2>

          <Link
            href="/admin/demandes"
            className="block text-blue-600 hover:underline"
          >
            Gérer les demandes de formateur
          </Link>
        </div>
      )}
    </main>
  )
}