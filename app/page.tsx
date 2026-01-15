import Dashboard from "@/components/Dashboard";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-[1600px]">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4 pb-6 border-b">
          <Image
            src="/img.png"
            alt="Logo"
            width={120}
            height={48}
            className="h-12 w-auto"
          />
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Opération Ramadan 1447
            </h1>
            <p className="text-muted-foreground">Tableau de bord</p>
          </div>
        </div>

        <Dashboard />
      </div>
    </main>
  );
}
