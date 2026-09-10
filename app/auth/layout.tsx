export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="app-shell flex flex-col">{children}</div>;
}
