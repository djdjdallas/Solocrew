'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function DealGallery({ thumbnailUrl, galleryUrls = [] }) {
  const [selectedImage, setSelectedImage] = useState(thumbnailUrl);
  
  // Combine thumbnail with gallery images
  const allImages = [thumbnailUrl, ...(galleryUrls || [])].filter(Boolean);
  
  // If no images are provided, use a placeholder
  if (allImages.length === 0) {
    allImages.push('/images/placeholder.jpg');
  }
  
  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-lg bg-muted">
        <div className="relative aspect-video">
          <Image
            src={selectedImage || allImages[0]}
            alt="Featured image"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
      
      {allImages.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {allImages.map((image, index) => (
            <button
              key={index}
              className={cn(
                "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md",
                selectedImage === image && "ring-2 ring-primary ring-offset-2"
              )}
              onClick={() => setSelectedImage(image)}
            >
              <Image
                src={image}
                alt={`Gallery image ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
