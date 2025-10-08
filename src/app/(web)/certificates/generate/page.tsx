import NewCertificateForm from "@/components/certificates/new-certificate-form";
import NotAuthenticated from "@/components/not-authenticated";
import { TypographyH3 } from "@/components/ui/typography";
import { getEvents } from "@/services";
import { getSession } from "@/services/auth";

export default async function Page() {
  const session = await getSession();
  if (!session) {
    return <NotAuthenticated />;
  }

  // @ts-ignore
  if (session.user?.role !== "administrator") {
    return <p>Not authorized</p>;
  }

  const events = await getEvents({});

  return (
    <div className="content-wrapper">
      <div className="content">
        <TypographyH3>Buat Sertifikat</TypographyH3>
        <div className="mt-4">
          <NewCertificateForm events={events} />
        </div>
      </div>
    </div>
  );
}
