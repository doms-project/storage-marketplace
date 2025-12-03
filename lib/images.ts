// Default placeholder images based on unit type
export const getDefaultImage = (unitType: string): string => {
  const type = unitType.toLowerCase();
  
  // Use Unsplash for high-quality placeholder images
  const images: Record<string, string> = {
    'garage': 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=600&fit=crop',
    'warehouse': 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop',
    'boat storage': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    'rv storage': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    'driveway': 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
    'other': 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop'
  };
  
  // Check for partial matches
  if (type.includes('boat') || type.includes('marine')) {
    return images['boat storage'];
  }
  if (type.includes('rv') || type.includes('recreational')) {
    return images['rv storage'];
  }
  if (type.includes('warehouse') || type.includes('storage')) {
    return images['warehouse'];
  }
  if (type.includes('garage')) {
    return images['garage'];
  }
  if (type.includes('driveway') || type.includes('parking')) {
    return images['driveway'];
  }
  
  return images[type] || images['other'];
};
