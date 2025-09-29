// src/components/Admin/AdminLayout.jsx
import Header from "./Header";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6 bg-gray-100 flex-1">{children}</main>
      </div>
    </div>
  );
}
