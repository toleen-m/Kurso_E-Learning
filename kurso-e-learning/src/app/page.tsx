import { currentUser } from "@clerk/nextjs/server"
import { syncUser } from "@/actions/user.actions"
import Link from "next/link"
import prisma from "@/lib/prisma"

export default async function Home() {

  const cours = await prisma.cours.findMany({ 
    orderBy: { 
      createdAt: "desc", 
    }, 
    take: 3, 
  }); 
  
  const nombreCours = await prisma.cours.count(); 

  return ( 
    <main className="min-h-screen bg-slate-50"> 

      <section className="bg-purple-700 text-white py-20 px-6"> 

        <div className="max-w-5xl mx-auto text-center"> 
          <h1 className="text-5xl font-bold mb-5"> 
            Bienvenue sur Kurso 
          </h1> 
          <p className="text-xl text-purple-100 mb-8"> 
            Apprends, progresse et développe de nouvelles compétences à ton propre rythme. 
          </p> 
          
          <Link href="/cours" className="inline-block bg-white text-purple-700 font-semibold px-6 py-3 rounded-lg hover:bg-purple-50 transition" > 
            Découvrir les cours 
          </Link> 
        </div> 
        
      </section> 

          <section className="max-w-5xl mx-auto px-6 py-12"> 
            <div className="grid md:grid-cols-3 gap-6 mb-12"> 

              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center"> 
                <p className="text-4xl font-bold text-purple-600"> 
                  {nombreCours} 
                </p> 
                <p className="text-slate-500 mt-2"> 
                  Cours disponibles 
                </p> 
              </div> 

              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center"> 
                <p className="text-4xl font-bold text-purple-600"> 
                  📚 
                </p> 
                <p className="text-slate-500 mt-2"> 
                  Apprends de nouvelles compétences 
                </p> 
              </div> 
              
              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center"> 
                <p className="text-4xl font-bold text-purple-600"> 
                  🎯 
                </p> 
                <p className="text-slate-500 mt-2"> 
                  Progresse à ton rythme 
                </p> 
              </div> 

            </div> 

            <div> 
              <h2 className="text-2xl font-bold text-slate-900 mb-6"> 
                Découvre nos cours 
              </h2> 
              
              {cours.length === 0 ? ( 
                <div className="bg-white border border-slate-200 rounded-xl p-8 text-center"> 
                  <p className="text-slate-500"> 
                    Aucun cours disponible pour le moment. 
                  </p> 
                </div> 
              ) : ( 

                <div className="grid md:grid-cols-3 gap-6"> 

                  {cours.map((cours) => ( 
                    <div key={cours.id} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition" > 
                      <p className="text-sm text-purple-600 font-medium"> 
                        {cours.niveau} 
                      </p> 
                      
                      <h3 className="text-xl font-bold text-slate-900 mt-2"> 
                        {cours.titre} 
                      </h3> 
                      
                      <p className="text-slate-500 mt-3 line-clamp-3"> 
                        {cours.description} 
                      </p> 
                      
                      <Link href={`/cours/${cours.id}`} className="inline-block mt-5 text-purple-600 font-medium hover:text-purple-800" > 
                        Voir le cours → 
                      </Link> 
                    </div> 
                  ))} 

                </div> 
              )} 

            </div> 
          </section> 
    </main> );
}