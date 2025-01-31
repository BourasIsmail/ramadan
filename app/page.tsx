import Dashboard from "@/components/Dashboard";

export default function Home() {
    return (
        <main className="container mx-auto p-4">
            <img src="/img.png" alt="Logo" className="h-12 w-30 " />
            <div className="flex items-center justify-center mb-4">
                <h1 className="text-3xl font-bold text-center">
                    Opération Ramadan
                </h1>
            </div>
            <Dashboard />
        </main>
    );
}
