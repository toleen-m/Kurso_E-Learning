import { currentUser } from "@clerk/nextjs/server"
import { syncUser } from "@/actions/user.actions"

export default async function Home() {
  const clerkUser = await currentUser()

  if (!clerkUser) {
    return (
      <main>
        <h1>Kurso E-Learning</h1>
        <p>Connecte-toi avec le bouton en haut.</p>
      </main>
    )
  }

  const user = await syncUser()

  return (
    <main>
      <h1>Kurso E-Learning</h1>
      <p>{user.email}</p>
      <p>Role: {user.role}</p>
    </main>
  )
}