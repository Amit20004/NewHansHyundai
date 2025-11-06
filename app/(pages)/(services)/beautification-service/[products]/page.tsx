// Server Component
import ProductClient from './productClient';

// Define the reference links array here as it's static data
const refLinks = [
  { label: "Beautification Overview", href: "beautification-overview" },
  { label: "Exterior Beautification", href: "exterior-beautification" },
  { label: "Alloy Wheel Polish", href: "alloy-wheel-polish" },
  { label: "Emblem Cleaning", href: "emblem-cleaning" },
  { label: "Head Lamp Restoration", href: "head-lamp-restoration" },
  { label: "Silencer Coating", href: "silencer-coating" },
];

export default async function BeautificationProductsPage({ params }: { params: { products: string } }) {
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