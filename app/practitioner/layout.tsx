import NavigationBar from "@/components/custom/NavigationBar";
import { AuthProvider } from "@/contexts/AuthContext";

export default function PractitionerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pb-20">
        <AuthProvider>{children}</AuthProvider>
      </main>
      <NavigationBar role={"practitioner"} />
    </div>
  );
}
