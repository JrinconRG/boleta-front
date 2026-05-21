import './globals.css';

export const metadata = {
  title: 'Mi Boleta',
  description: 'Sistema de Tickets',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}