// Server Component
import ProductClient from './productClient'

const refLinks = [
    {label:"Tire Alignmnet Service Overview", href:"tire-overview"},
  { label: "Tyres", href: "tyre" },
  { label: "Battery", href: "battery" },
  { label: "Wheel Alignment and Balancing", href: "wheel-alignment" },
  { label: "Synthetic Oil", href: "synthetic-oil" }
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