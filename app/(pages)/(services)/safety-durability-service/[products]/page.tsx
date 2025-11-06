// Server Component
import ProductClient from './productClient'
const refLinks=[
  { label: "safety & Durability Overview", href: "safety-overview" },
  { label: "Rodent Repellent", href: "rodent-repellent" },
  { label: "Paint Protection UV", href: "paint-protection-uv" },
  { label: "Engine Cleaning/Dressing", href: "engine-cleaningdressing" },
  { label: "Service Pro", href: "service-pro" },
  { label: "EGR Cleaner", href: "egr-cleaner" },
  { label: "Underbody Coating", href: "underbody-coating" }
]

export default async function SafetyPage({ params }: { params: { products: string } }) {
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