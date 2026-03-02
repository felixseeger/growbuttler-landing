/**
 * Script to create test plants and journal entries
 * Run with: node scripts/seed-test-data.js
 */

const testPlants = [
  {
    name: "Blue Dream",
    strain: "Blue Dream (Sativa-Dominant Hybrid)",
    stage: "vegetative",
    location: "Tent A",
    startDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days ago
    note: "Plants are developing nicely with strong stems and vibrant green leaves. Increased light intensity to 600W. Fan leaves are spreading well.",
    temperature: 76,
    humidity: 60,
    phLevel: "6.3",
    nutrientMix: "Flora Grow (2-1-6)"
  },
  {
    name: "Northern Lights",
    strain: "Northern Lights #5 (Indica)",
    stage: "flowering",
    location: "Tent B",
    startDate: new Date(Date.now() - 56 * 24 * 60 * 60 * 1000).toISOString(), // 56 days ago (8 weeks)
    note: "Flowering week 2 - First pistils appearing! Trichome development starting on sugar leaves. Switched to 12/12 light cycle. Beautiful purple hues developing.",
    temperature: 72,
    humidity: 50,
    phLevel: "6.0",
    nutrientMix: "Flora Bloom (0-5-4)"
  },
  {
    name: "Girl Scout Cookies",
    strain: "GSC (Hybrid)",
    stage: "seedling",
    location: "Propagation Station",
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    note: "Seedling just emerged! First true leaves showing. Keeping humidity dome on for 2 more days. Root development looks healthy in clear cup.",
    temperature: 78,
    humidity: 70,
    phLevel: "6.5",
    nutrientMix: "Light Seedling Mix (quarter strength)"
  }
];

console.log('Test Data Configuration:');
console.log('========================\n');

testPlants.forEach((plant, index) => {
  const daysSinceStart = Math.floor((Date.now() - new Date(plant.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const weeksSinceStart = Math.ceil(daysSinceStart / 7);

  console.log(`Plant ${index + 1}: ${plant.name}`);
  console.log(`  Strain: ${plant.strain}`);
  console.log(`  Stage: ${plant.stage}`);
  console.log(`  Location: ${plant.location}`);
  console.log(`  Day: ${daysSinceStart}`);
  console.log(`  Week: ${weeksSinceStart}`);
  console.log(`  Start Date: ${new Date(plant.startDate).toLocaleDateString()}`);
  console.log(`  Note: ${plant.note.substring(0, 50)}...`);
  console.log(`  Temperature: ${plant.temperature}°F`);
  console.log(`  Humidity: ${plant.humidity}%`);
  console.log(`  pH Level: ${plant.phLevel}`);
  console.log(`  Nutrients: ${plant.nutrientMix}`);
  console.log('');
});

console.log('\nTo create these plants through the UI:');
console.log('1. Login to the dashboard');
console.log('2. Click "Seed New Life" or "+ Add Plant"');
console.log('3. Fill in the details above');
console.log('4. Upload an image (use plant photos)');
console.log('5. After creating each plant, add a journal entry with the data above');
console.log('\nOr use the API endpoints directly with the data provided.');

module.exports = testPlants;
