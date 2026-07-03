import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex flex-1 max-w-[1600px] mx-auto w-full">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 lg:p-10 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
