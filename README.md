# CSV URL File Downloader

This simple Node.js script reads a CSV file containing URLs and downloads all the files to a local folder.

---

## Features

- Reads URLs from a CSV file with a `Link` column.
- Automatically extracts filenames from URLs.
- Downloads files concurrently.
- Shows a summary with total, successful, and failed downloads.
- Saves files to a local `downloads` folder.

---

## Requirements

- Node.js (v12 or newer recommended)
- npm (Node package manager)

---

## Setup Instructions

1. **Clone or download this project**

2. **Open terminal and navigate to project folder**

3. **Install dependencies**

   ```bash
   npm install

   
4.Prepare your CSV file

Create a file named urls.csv in the project folder.

Add a header called Link and list your URLs underneath. Example:

Link
https://example.com/image1.jpg
https://example.com/doc2.pdf

5. Run the downloader script

node download.js

## What happens when you run the script?

**It reads all URLs from urls.csv.

**Creates a downloads folder (if it doesn't exist).

**Downloads each file into the downloads folder.

**Shows a summary of how many files were processed, downloaded successfully, or failed.

## Troubleshooting

**Make sure your URLs are accessible and correct.

**If a download fails, check the error message in the terminal.

**Ensure you have a stable internet connection.

**The script uses streaming to handle large files efficiently.



