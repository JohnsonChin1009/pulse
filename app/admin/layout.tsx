
import AdminNavigator from "@/app/admin/navigator";
import { AuthProvider } from "./authContext";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div>
        <AuthProvider>
        <AdminNavigator />
        {children}
      </AuthProvider>
      </div>
  );
}
