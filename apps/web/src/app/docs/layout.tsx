import type { Metadata } from "next";
import DocsLayoutClient from "../../components/DocsLayoutClient";

export const metadata: Metadata = {
  metadataBase: new URL("https://rqsh.vercel.app"),
  title: "Documentation — RQSH",
  description: "Learn how to use RQSH: interactive REPL commands, keyboard bindings, syntax mappings, and system slash commands.",
  openGraph: {
    title: "Documentation — RQSH",
    description: "Learn how to use RQSH: interactive REPL commands, keyboard bindings, syntax mappings, and system slash commands.",
    url:"https://rqsh.vercel.app/docs/getting-started",
    siteName:"RQSH",
    images: [
      {
        url: "/opengraph-image-docs.png",
        width: 1200,
        height: 630,
        alt: "RQSH Documentation",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Documentation — RQSH",
    description: "Learn how to use RQSH: interactive REPL commands, keyboard bindings, syntax mappings, and system slash commands.",
    images: ["/opengraph-image-docs.png"],
    creator: "@abhimanyutwts"
  },
};

interface DocsLayoutProps {
  children: React.ReactNode;
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  return <DocsLayoutClient>{children}</DocsLayoutClient>;
}
