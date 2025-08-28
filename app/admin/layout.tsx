
import AdminNavigator from "@/app/admin/navigator";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <AdminNavigator />
      {children}
    </div>
  );
}
