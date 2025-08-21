const { exec } = require("child_process");
const path = require("path");

// Set the paths to your project directories
const serverDir = path.join(__dirname, "server");
const clientDir = path.join(__dirname, "client");

// Function to start the server
function startServer() {
  const serverProcess = exec(
    "npm run start",
    { cwd: serverDir, maxBuffer: undefined },
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Server error: ${error}`);
      } else {
        console.log("Server started successfully!");
      }
    }
  );

  let serverBuffer = "";

  serverProcess.stdout.on("data", (data) => {
    serverBuffer += data;
    // process.stdout.write(data); // To see the server output in the console
  });

  serverProcess.stderr.on("data", (data) => {
    serverBuffer += data;
    // process.stderr.write(data); // To see the server error output in the console
  });

  // Clear the buffer every 10 seconds
  setInterval(() => {
    serverBuffer = "";
  }, 10000);
}

// Function to start the client
function startClient() {
  const clientProcess = exec(
    "serve -s -l 4000",
    { cwd: clientDir, maxBuffer: undefined },
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Client error: ${error}`);
      } else {
        console.log("Client started successfully!");
      }
    }
  );

  let clientBuffer = "";

  clientProcess.stdout.on("data", (data) => {
    clientBuffer += data;
    // process.stdout.write(data); // To see the client output in the console
  });

  clientProcess.stderr.on("data", (data) => {
    clientBuffer += data;
    // process.stderr.write(data); // To see the client error output in the console
  });

  // Clear the buffer every 10 seconds
  setInterval(() => {
    clientBuffer = "";
  }, 10000);
}

// Function to start both the server and the client
function startAll() {
  startServer();
  startClient();
  console.log("PEOPLE TRACKING APPLICATION RUNNING");
}

startAll();

// const { exec } = require("child_process");
// const path = require("path");

// // Set the paths to your project directories
// const serverDir = path.join(__dirname, "server");
// const clientDir = path.join(__dirname, "client/dist");

// // Function to start the server in a new terminal window
// function startServer() {
//   exec(
//     `start cmd /K "cd /d ${serverDir} && npm run dev"`,
//     (error, stdout, stderr) => {
//       if (error) {
//         console.error(`Server error: ${error}`);
//       } else {
//         console.log("Server started successfully!");
//       }
//     }
//   );
// }

// // Function to start the client in a new terminal window
// function startClient() {
//   exec(
//     `start cmd /K "cd /d ${clientDir} && serve -l 4000"`,
//     (error, stdout, stderr) => {
//       if (error) {
//         console.error(`Client error: ${error}`);
//       } else {
//         console.log("Client started successfully!");
//       }
//     }
//   );
// }

// // Function to start both the server and the client
// function startAll() {
//   startServer();
//   startClient();
//   console.log("PEOPLE TRACKING APPLICATION RUNNING");
// }

// startAll();
