'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0b0f19]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0b0f19]/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
              <Image src="/logo.svg" alt="Wakagratte" width={128} height={128} />
            </Link>
          <div className="flex items-center gap-6">
            <Link href="/tuner" className="text-sm text-gray-400 hover:text-white transition-colors">
              Accordeur
            </Link>
            <Link href="/play">
              <Button size="sm">Jouer</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-transparent to-transparent" />

        <div className="relative text-center max-w-3xl">
          <div className="mb-10">
            <Image src="/logo.svg" alt="Wakagratte" width={640} height={640} className="mx-auto" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Joue la musique
            <br />
            <span className="text-amber-500">que tu aimes</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-xl mx-auto leading-relaxed">
            Apprends la guitare de manière ludique avec des séquences musicales
            validées en temps réel par ton micro.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/play">
              <Button size="lg">Commencer gratuitement</Button>
            </Link>
            <Link href="/tuner">
              <Button size="lg" variant="secondary">
                Accorder ma guitare
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-[#0d111c]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            Comment ça marche
          </h2>
          <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
            Une méthode simple et efficace pour progresser à la guitare
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#151a28] rounded-2xl p-8 border border-white/5">
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Accorde ta guitare</h3>
              <p className="text-gray-400 leading-relaxed">
                Utilise notre accordeur intégré avec détection de pitch précise.
                Plusieurs accordages disponibles.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#151a28] rounded-2xl p-8 border border-white/5">
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Choisis une séquence</h3>
              <p className="text-gray-400 leading-relaxed">
                Sélectionne parmi nos séquences musicales. Chaque note est
                visualisée sur le manche de guitare.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#151a28] rounded-2xl p-8 border border-white/5">
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Joue et progresse</h3>
              <p className="text-gray-400 leading-relaxed">
                L&apos;app écoute ce que tu joues et valide chaque note
                en temps réel. Tu vois ta progression instantanément.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt à commencer ?
          </h2>
          <p className="text-gray-400 mb-10 text-lg">
            Aucune inscription requise. Connecte ton micro et joue.
          </p>
          <Link href="/play">
            <Button size="lg">Lancer une séquence</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Image src="/logo.svg" alt="Wakagratte" width={48} height={48} />
          <div className="flex items-center gap-6">
            <Link href="/tuner" className="text-sm text-gray-500 hover:text-white transition-colors">
              Accordeur
            </Link>
            <Link href="/play" className="text-sm text-gray-500 hover:text-white transition-colors">
              Séquences
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
