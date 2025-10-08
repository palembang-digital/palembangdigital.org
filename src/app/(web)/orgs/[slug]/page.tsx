import { auth } from "@/auth";
import { FloatingHeader } from "@/components/floating-header";
import { ScrollArea } from "@/components/scroll-area";
import { Button } from "@/components/ui/button";
import { TypographyH3 } from "@/components/ui/typography";
import { getOrg } from "@/services/orgs";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import type { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const org = await getOrg(params.slug);
  if (!org) {
    return {
      title: "Organization not found",
    };
  }

  const desc = `Lihat profil dan kegiatan ${org.name} di Palembang Digital.`;

  return {
    title: org.name,
    description: desc,
    keywords: [
      org.name,
      org.organizationType || "",
      "organisasi",
      "organization",
      "palembang",
      "palembang digital",
    ],
    openGraph: {
      title: `${org.name} · Palembang Digital`,
      description: desc,
      // images: `/orgs/${params.slug}/og.png`,
      type: "article",
    },
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const session = await auth();

  const org = await getOrg(params.slug);
  if (!org) {
    return {
      title: "Organization not found",
    };
  }

  return (
    <ScrollArea useScrollAreaId>
      <FloatingHeader
        session={session}
        scrollTitle={org.name}
        goBackLink="/ecosystem"
      />
      <div className="content-wrapper">
        <div className="content">
          <div className="flex flex-col items-center justify-center">
            {org.image && (
              <img src={org.image} alt={org.name} width={240} height={240} />
            )}
            <TypographyH3 className="mt-4">{org.name}</TypographyH3>
            <div className="text-gray-500">{org.organizationType}</div>
            {org.website && (
              <Link
                href={`${org.website}?ref=palembangdigital.org`}
                target="_blank"
                className="mt-4"
              >
                <Button variant="outline" size="sm">
                  Website <ExternalLinkIcon className="h4 w-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
