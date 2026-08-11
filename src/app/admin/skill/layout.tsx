import AdminLayout from "@/common/layouts/AdminLayout";

export default async function LayoutSkill({ children }: { children: React.ReactNode }) {
   return <AdminLayout>{children}</AdminLayout>;
}
