import { redirect } from "next/navigation";

// Cette fonction s'exécute côté serveur
function checkServerAuth() {
  // Pour l'instant, on ne laisse passer personne en développement
  // En production, vous pourriez vérifier les cookies ou sessions ici
  return false;
}

export default function Home() {
  const isAuthenticated = checkServerAuth();

  if (!isAuthenticated) {
    redirect("/login");
  }

  // Si authentifié, rediriger vers la boîte de réception
  redirect("/home/dashboard");
}
