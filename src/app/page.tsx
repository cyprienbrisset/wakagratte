import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background avec gradient (placeholder pour image) */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1f2e] via-[#0d111c] to-[#0b0f19]">
        {/* Overlay pattern pour effet visuel */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl" />
        </div>
        {/* Overlay sombre */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Contenu centre */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/logo.svg"
            alt="Wakagratte"
            width={180}
            height={60}
            priority
          />
        </div>

        {/* Titre */}
        <h1 className="text-3xl md:text-5xl font-bold text-white text-center mb-8 max-w-2xl">
          Apprends la guitare avec des cheat codes
        </h1>

        {/* Sous-titre */}
        <p className="text-gray-400 text-lg text-center mb-10 max-w-md">
          Des sequences de notes comme des codes secrets a maitriser
        </p>

        {/* CTA Button */}
        <Link
          href="/play"
          className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold text-lg px-10 py-4 rounded-full transition-all hover:scale-105 shadow-lg shadow-amber-500/25"
        >
          Commencer maintenant
        </Link>

        {/* Lien secondaire (optionnel) */}
        <p className="mt-8 text-gray-500 text-sm">
          Deja joueur ?{' '}
          <Link href="/play" className="text-amber-500 hover:underline">
            Voir les sequences
          </Link>
        </p>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 py-4 z-10">
        <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
          <span>&copy; 2024 Wakagratte</span>
        </div>
      </footer>
    </main>
  );
}
