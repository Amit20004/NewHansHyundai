// Server Component
import ProductClient from './productClient'

const refLinks = [
  { label: "Health & Hygiene Overview", href: "hygiene-overview" },
  { label: "Interior Smoke Sanitization", href: "interior-smoke-sanitization" },
  { label: "Premium Interior ( foam It )", href: "premium-interior" },
  { label: "AC Disinfectant/Aircon Klene", href: "ac-disinfectant" },
  { label: "AC Evaporator Cleaner", href: "ac-evaporator-cleaner" },
  { label: "Interior Anti-Microbial Treatment", href: "interior-anti-microbial-treatment" },
  { label: "Interior Enrichment", href: "interior-enrichment" },
];


export default async function HealthHygienePage({ params }: { params: { products: string } }) {
  // Find the product data on the server side
  const data = refLinks.find((link) => link.href.endsWith(params.products));

  // If no data is found, you can handle the error here (e.g., return a 404 page)
  if (!data) {
    return <div>Product not found!</div>;
  }

  // Pass the found data as a prop to the Client Component
  return (
    <div>
      <ProductClient initialData={data} refLinks={refLinks} />
    </div>
  );
}