import { Session } from "next-auth";
import Link from "next/link";

import { NavigationLink } from "@/components/navigation-link";
import { SignIn } from "@/components/sign-in";
import { MENU_LINKS } from "@/lib/constants";

interface MenuContentProps {
  session: Session | null;
}

export function MenuContent({ session }: MenuContentProps) {
  return (
    <div className="flex w-full flex-col text-sm">
      <div className="flex flex-col gap-4">
        <Link href="/" className="link-card inline-flex items-center gap-2 p-2">
          <img
            src="/logo-black-bg.png"
            alt="Palembang Digital"
            width={30}
            height={30}
            loading="lazy"
          />
          <div className="flex flex-col">
            <span className="text-base font-semibold tracking-tight">
              Palembang Digital
            </span>
          </div>
        </Link>

        <div className="flex flex-col gap-1">
          {MENU_LINKS.map((link) => (
            <NavigationLink
              key={link.href}
              href={link.href}
              label={link.label}
              icon={link.icon}
            />
          ))}
          {session ? (
            <NavigationLink
              // @ts-ignore
              href={`/${session.user?.username}`}
              label={session.user?.name || "Profil"}
              icon={
                <div className="relative size-6">
                  <img
                    src={session.user?.image || ""}
                    className="rounded-full size-full object-cover"
                    alt={session.user?.name || "Profile Picture"}
                  />
                </div>
              }
            />
          ) : (
            <SignIn />
          )}
        </div>
      </div>
    </div>
  );
}
