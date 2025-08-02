import Domain from "@/components/domain";
import Navbar from "@/components/navbar";
import { getDomain } from "@/lib/actions";

export default async function Home() {
  const initialDomain = await getDomain();

  return (
    <section className="max-w-5xl mx-auto">
      <Navbar />
      <Domain initialDomain={initialDomain || ""} />
    </section>
  );
}
