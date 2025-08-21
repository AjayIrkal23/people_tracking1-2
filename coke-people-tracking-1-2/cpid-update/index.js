const axios = require("axios");

// Function to generate CPID and GWID combinations
function generateCPIDGWIDCombinations() {
  const combinations = [];

  // CPID 101-108 with GWID 201
  for (let cpid = 101; cpid <= 108; cpid++) {
    combinations.push({ cpid, gwid: 201 });
  }

  // CPID 109-116 with GWID 202
  for (let cpid = 109; cpid <= 116; cpid++) {
    combinations.push({ cpid, gwid: 202 });
  }

  // CPID 151-158 with GWID 226
  for (let cpid = 151; cpid <= 158; cpid++) {
    combinations.push({ cpid, gwid: 226 });
  }

  // CPID 159-166 with GWID 227
  for (let cpid = 159; cpid <= 166; cpid++) {
    combinations.push({ cpid, gwid: 227 });
  }

  return combinations;
}

// Function to send beacon update request
async function sendBeaconUpdate(gwid, cpid) {
  try {
    const url = `http://localhost:3000/api/v1/beacon/update`;
    const params = {
      GWID: gwid,
      CPID: cpid,
      BNID: 0,
      SOS: "L",
      IDLE: "L",
      BATTERY: 0,
    };

    const response = await axios.post(url, null, { params });
    console.log(
      `Sent beacon update for GWID: ${gwid}, CPID: ${cpid} - Status: ${response.status}`
    );
  } catch (error) {
    console.error(
      `Error sending beacon update for GWID: ${gwid}, CPID: ${cpid}:`,
      error.message
    );
  }
}

// Main function to send updates hourly
async function runBeaconUpdates() {
  const combinations = generateCPIDGWIDCombinations();

  async function sendUpdates() {
    for (const { cpid, gwid } of combinations) {
      await sendBeaconUpdate(gwid, cpid);
      // Add a small delay between requests to prevent overwhelming the server
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    console.log("Completed one full cycle of beacon updates");
  }

  // Send updates immediately
  await sendUpdates();

  // Then set up hourly interval
  setInterval(sendUpdates, 60 * 60 * 1000);
}

// Start the beacon update process
runBeaconUpdates().catch(console.error);
