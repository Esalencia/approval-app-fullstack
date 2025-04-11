export function extractDimensions(text) {
    const dimensionPatterns = [
      /(\d+(?:\.\d+)?)\s*(?:m|meters|meter)/g,
      /(\d+(?:\,\d+)?)\s*(?:mm|millimeters|millimeter)/g
    ];
  
    const dimensions = [];
    
    for (const pattern of dimensionPatterns) {
      const matches = [...text.matchAll(pattern)];
      for (const match of matches) {
        let val = match[1].replace(',', '.');
        val = parseFloat(val);
        if (pattern.source.includes('mm')) {
          val = val / 1000;
        }
        dimensions.push(val);
      }
    }
  
    return dimensions;
  }
  
  export function extractAreas(text) {
    const areaPattern = /(\d+(?:\.\d+)?)\s*(?:sq\.?\s+m|square\s+meters?|m2|m²)/g;
    const areas = [...text.matchAll(areaPattern)].map(m => parseFloat(m[1]));
    return areas;
  }
  
  export function extractFloorCount(text) {
    const floorPattern = /(\d+)[\s-]store(?:y|ies)/g;
    const floors = [...text.matchAll(floorPattern)].map(m => parseInt(m[1]));
    return floors;
  }