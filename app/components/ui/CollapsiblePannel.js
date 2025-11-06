'use client';


export default function SplitPanels() {


  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Dark gradient overlay on background image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(to bottom right, rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url('https://images.pexels.com/photos/12353734/pexels-photo-12353734.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>

    
    </div>
  );
}
