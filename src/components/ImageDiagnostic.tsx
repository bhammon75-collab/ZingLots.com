import { useState, useEffect } from 'react';

const ImageDiagnostic = () => {
  const [imageStatus, setImageStatus] = useState<Record<string, boolean>>({});
  
  const imagesToCheck = [
    '/categories/constructionreal.jpg',
    '/categories/restaurantreal.jpg',
    '/categories/officereal.jpg',
    '/categories/municipalreal.jpg',
    '/categories/blacksmithreal.jpg',
    '/categories/jewelrymakingreal.jpg',
    // Fallback images
    '/categories/construction.jpg',
    '/categories/restaurant.jpg',
    '/categories/office.jpg',
    '/categories/municipal.jpg',
    '/categories/industrial.jpg',
    '/categories/vehicles.jpg',
    // Placeholder
    '/placeholder.jpg'
  ];

  useEffect(() => {
    imagesToCheck.forEach(src => {
      const img = new Image();
      img.onload = () => {
        setImageStatus(prev => ({ ...prev, [src]: true }));
      };
      img.onerror = () => {
        setImageStatus(prev => ({ ...prev, [src]: false }));
      };
      img.src = src;
    });
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-white border rounded-lg shadow-lg p-4 max-w-md max-h-96 overflow-auto z-50">
      <h3 className="font-bold mb-2">Image Diagnostic</h3>
      <div className="text-xs space-y-1">
        {imagesToCheck.map(src => (
          <div key={src} className="flex items-center gap-2">
            <span className={`inline-block w-3 h-3 rounded-full ${
              imageStatus[src] === true ? 'bg-green-500' : 
              imageStatus[src] === false ? 'bg-red-500' : 
              'bg-gray-300'
            }`} />
            <span className={imageStatus[src] === false ? 'text-red-600' : ''}>
              {src}
            </span>
          </div>
        ))}
      </div>
      <button 
        onClick={() => window.location.reload()} 
        className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs"
      >
        Refresh
      </button>
    </div>
  );
};

export default ImageDiagnostic;