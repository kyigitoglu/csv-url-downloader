// Import required modules
const fs = require('fs');           // File system module for reading/writing files
const path = require('path');       // Path module to handle file paths
const axios = require('axios');     // Axios to make HTTP requests (download files)
const csv = require('csv-parser');  // CSV parser to read CSV files

// Define the folder where downloaded files will be saved
const DOWNLOAD_DIR = path.join(__dirname, 'downloads');

// Check if the download folder exists; if not, create it
if (!fs.existsSync(DOWNLOAD_DIR)) {
  fs.mkdirSync(DOWNLOAD_DIR);
}

// Initialize counters to track download progress
let totalCount = 0;      // Total URLs found in CSV
let successCount = 0;    // Number of successful downloads
let failureCount = 0;    // Number of failed downloads

// Array to keep track of all ongoing download promises
let downloadPromises = [];

// Create a read stream for the CSV file 'urls.csv' and pipe it through the CSV parser
fs.createReadStream('urls.csv')
  .pipe(csv())
  // For each row (each URL) in the CSV file:
  .on('data', (row) => {
    const url = row.Link;   // Extract the URL from the 'Link' column
    if (!url) return;       // Skip if URL is empty or missing

    totalCount++;           // Increase total count for each URL found

    // Extract filename from the URL by getting the last part of the path
    const filename = path.basename(new URL(url).pathname);
    // Create the full path for where the file will be saved
    const filePath = path.join(DOWNLOAD_DIR, filename);

    // Start the download request using axios
    const downloadPromise = axios({
      method: 'GET',
      url: url,
      responseType: 'stream',  // Stream the response to handle large files efficiently
    })
      .then((response) => {
        // Return a promise that resolves when the file write finishes
        return new Promise((resolve, reject) => {
          // Create a writable stream to save the file locally
          const writer = fs.createWriteStream(filePath);
          // Pipe the HTTP response data into the file writer
          response.data.pipe(writer);

          // When writing finishes successfully
          writer.on('finish', () => {
            successCount++;                          // Increment success counter
            console.log(`✅ Downloaded: ${filename}`);  // Log success message
            resolve();                              // Resolve the promise
          });

          // Handle errors during writing the file
          writer.on('error', (err) => {
            failureCount++;                          // Increment failure counter
            console.error(`❌ Failed to write ${filename}:`, err.message);  // Log error message
            reject(err);                            // Reject the promise
          });
        });
      })
      // Handle errors during the HTTP request itself (e.g., network errors, 404)
      .catch((err) => {
        failureCount++;                            // Increment failure counter
        console.error(`❌ Failed to download ${url}:`, err.message);  // Log error message
      });

    // Add the current download promise to the array for later tracking
    downloadPromises.push(downloadPromise);
  })
  // When CSV reading is finished:
  .on('end', async () => {
    console.log(`\n📦 Found ${totalCount} files to download...`);

    // Wait until all downloads have finished (either success or failure)
    await Promise.allSettled(downloadPromises);

    // Print a summary of the download results
    console.log('\n📊 Download Summary:');
    console.log(`🔢 Total:    ${totalCount}`);
    console.log(`✅ Success:  ${successCount}`);
    console.log(`❌ Failed:   ${failureCount}`);
  });
