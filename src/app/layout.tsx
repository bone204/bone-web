'use client';
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import AppHeader from "@/components/app.header";
import AppFooter from "@/components/app.footer";
import { Container } from "react-bootstrap";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppHeader></AppHeader>
        <Container>
          {children}
        </Container>
        <AppFooter></AppFooter>
      </body>
    </html>
  );
}
