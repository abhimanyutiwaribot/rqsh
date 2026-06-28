import type { Metadata } from "next";
import DocsLayoutClient from "../../components/DocsLayoutClient";

export const metadata: Metadata = {
  title: "Documentation — PostCLI",
  description: "Learn how to use PostCLI: interactive REPL commands, keyboard bindings, syntax mappings, and system slash commands.",
};

interface DocsLayoutProps {
  children: React.ReactNode;
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  return <DocsLayoutClient>{children}</DocsLayoutClient>;
}
