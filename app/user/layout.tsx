import NavigationBar from "@/components/custom/NavigationBar";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main content with bottom padding for navigation */}
      <main className="pb-20">
        {children}
      </main>
      
      {/* Bottom Navigation */}
      <NavigationBar />
    </div>
  );
}