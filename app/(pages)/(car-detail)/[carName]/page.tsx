// app/[carName]/page.tsx

import ResponsiveBanner from "../../../components/banner/ResponsiveBanner";
import StickyNavBar from "../../../components/StickyNavbar";

interface PageProps {
  params: { carName: string };
}

export default async function CarDetailPage({ params }: PageProps) {
  const { carName } = params;

  const res = await fetch(`http://localhost:8000/api/car-ebrochure-all/${carName}`, {
    cache: "no-store",
  });
  const data = await res.json();

  return (
    <div>
      <ResponsiveBanner />
      <StickyNavBar carName={carName} brochureData={data.data} />
    </div>
  );
}
