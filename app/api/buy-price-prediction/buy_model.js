const fs = require('fs');

function predictPrice(input, propertyData) {
  // Find matching properties
  const matchingProperties = propertyData.filter(p => 
    (p.locality.toLowerCase() === input.locality.toLowerCase() || 
     input.address.toLowerCase().includes(p.locality.toLowerCase())) && 
    p.region.trim().toLowerCase() === input.region.trim().toLowerCase()
  );

  // console.log("matchingProperties", matchingProperties);

  // Fallback to broader search if no exact matches
  const candidateProperties = matchingProperties.length > 0 
    ? matchingProperties 
    : propertyData.filter(p => 
        p.region.trim().toLowerCase() === input.region.trim().toLowerCase() || 
        p.locality.toLowerCase().includes(input.locality.toLowerCase())
      );

  if (candidateProperties.length === 0) {
    console.error("No matching properties found");
    return null;
  }

  // Sort and get top 5 similar properties
  const topCandidates = candidateProperties
    .sort((a, b) => {
      // Sort by similarity to input area
      const aDiff = Math.abs(a.area - input.area);
      const bDiff = Math.abs(b.area - input.area);
      return aDiff - bDiff;
    })
    .slice(0, 5);

  // Log similar properties for reference
  // console.log("Top 5 Similar Properties:");
//   topCandidates.forEach((prop, index) => {
//     console.log(`
// ${index + 1}. Property Details:
//    - Locality: ${prop.locality}
//    - Region: ${prop.region}
//    - Price: ₹${prop.price.toLocaleString()}
//    - Area: ${prop.area} sqft
//    - Price per Sqft: ₹${prop.pricePerSqft}
// `);
//   });

  // Calculate weighted average price per sqft
  const totalWeight = topCandidates.reduce((sum, _, index) => sum + (5 - index), 0);
  const weightedPricePerSqft = topCandidates.reduce((sum, prop, index) => {
    const weight = (5 - index) / totalWeight; // More weight to closer matches
    return sum + (prop.pricePerSqft * weight);
  }, 0);

  // Predict price using weighted average price per sqft and input area
  const predictedPrice = Math.round(weightedPricePerSqft * input.area);

  return predictedPrice > 0 ? predictedPrice : null;
}

// Read and process file
// fs.readFile('output_15MB.json', 'utf8', (err, data) => {
//   if (err) {
//     console.error("File read error:", err);
//     return;
//   }

//   try {
//     const propertyData = JSON.parse(data);
    
//     const input = {
//       locality: "Khar West",
//       region: " Mumbai",
//       area: 1000
//     };

//     const predictedPrice = predictPrice(input, propertyData);
//     console.log(predictedPrice 
//       ? `\nPredicted price: ₹${predictedPrice.toLocaleString()}` 
//       : "Prediction failed"
//     );
//   } catch (parseError) {
//     console.error("JSON parse error:", parseError);
//   }
// });

export { predictPrice };