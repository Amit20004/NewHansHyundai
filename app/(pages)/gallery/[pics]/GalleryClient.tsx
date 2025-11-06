import Gallery from './page'; // your current client component
// import { generateMeta } from '@/app/utils/metadata'; // optional reusable metadata function

export async function generateMetadata({ params }) {
  const slug = params.slug;

  // Optionally fetch metadata from backend:
  // const meta = await generateMeta({ slug, defaultTitle: 'Gallery' });

  return {
    title: `Gallery - ${slug}`,
    description: `View the photo gallery for ${slug}`,
    keywords: `gallery, images, photos, ${slug}`,
  };
}

const GalleryPage = ({ params }) => {
  return <Gallery metaData={params.slug} />;
};

export default GalleryPage;
