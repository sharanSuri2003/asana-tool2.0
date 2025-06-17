import ProtectedComponent from "@/components/protected-component";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedComponent>{children}</ProtectedComponent>;
}
