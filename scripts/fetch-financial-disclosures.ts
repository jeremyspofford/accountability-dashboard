/**
 * Financial Disclosure Scraper
 * 
 * Fetches and parses congressional financial disclosure PDFs to track
 * member wealth over time.
 * 
 * Data sources:
 * - Senate: https://efdsearch.senate.gov/search/
 * - House: https://disclosures-clerk.house.gov/FinancialDisclosure
 * 
 * Note: This requires manual PDF downloading initially as these sites
 * have anti-scraping measures. Future: automate with Puppeteer.
 */

import fs from "fs";
import path from "path";
// @ts-ignore - pdf-parse types
import pdf from "pdf-parse";

const DATA_DIR = path.join(__dirname, "../src/data");
const PDF_DIR = path.join(__dirname, "../.cache/disclosures");

interface AssetRange {
  min: number;
  max: number;
}

interface Asset {
  description: string;
  type: string;
  valueRange: AssetRange;
  incomeType: string | null;
  incomeRange: AssetRange | null;
}

interface FinancialDisclosure {
  bioguide_id: string;
  name: string;
  year: number;
  filing_date: string;
  chamber: "House" | "Senate";
  assets: Asset[];
  liabilities: Asset[];
  transactions: Array<{
    date: string;
    asset: string;
    type: "Purchase" | "Sale" | "Exchange";
    amountRange: AssetRange;
  }>;
  estimated_net_worth: AssetRange;
}

// Value range mappings from disclosure forms
const VALUE_RANGES: Record<string, AssetRange> = {
  "": { min: 0, max: 0 },
  "None": { min: 0, max: 0 },
  "$1 - $1,000": { min: 1, max: 1000 },
  "$1,001 - $15,000": { min: 1001, max: 15000 },
  "$15,001 - $50,000": { min: 15001, max: 50000 },
  "$50,001 - $100,000": { min: 50001, max: 100000 },
  "$100,001 - $250,000": { min: 100001, max: 250000 },
  "$250,001 - $500,000": { min: 250001, max: 500000 },
  "$500,001 - $1,000,000": { min: 500001, max: 1000000 },
  "$1,000,001 - $5,000,000": { min: 1000001, max: 5000000 },
  "$5,000,001 - $25,000,000": { min: 5000001, max: 25000000 },
  "$25,000,001 - $50,000,000": { min: 25000001, max: 50000000 },
  "Over $50,000,000": { min: 50000001, max: 100000000 },
};

function parseValueRange(text: string): AssetRange {
  // Clean up the text
  const cleaned = text.trim();
  
  // Check known ranges
  for (const [pattern, range] of Object.entries(VALUE_RANGES)) {
    if (cleaned.includes(pattern) || cleaned === pattern) {
      return range;
    }
  }
  
  // Try to parse custom range
  const rangeMatch = cleaned.match(/\$?([\d,]+)\s*-\s*\$?([\d,]+)/);
  if (rangeMatch) {
    return {
      min: parseInt(rangeMatch[1].replace(/,/g, "")),
      max: parseInt(rangeMatch[2].replace(/,/g, "")),
    };
  }
  
  // Single value
  const singleMatch = cleaned.match(/\$?([\d,]+)/);
  if (singleMatch) {
    const value = parseInt(singleMatch[1].replace(/,/g, ""));
    return { min: value, max: value };
  }
  
  return { min: 0, max: 0 };
}

async function parsePDF(pdfPath: string): Promise<string> {
  const buffer = fs.readFileSync(pdfPath);
  const data = await pdf(buffer);
  return data.text;
}

function extractAssets(text: string): Asset[] {
  const assets: Asset[] = [];
  
  // Look for asset table patterns
  // Format varies but typically: Description | Value | Income Type | Income
  const lines = text.split("\n");
  
  let inAssetSection = false;
  
  for (const line of lines) {
    // Detect asset section headers
    if (line.match(/SCHEDULE A|Part\s+[IVX]+.*Assets/i)) {
      inAssetSection = true;
      continue;
    }
    
    if (line.match(/SCHEDULE B|Part\s+[IVX]+.*Transactions|LIABILITIES/i)) {
      inAssetSection = false;
      continue;
    }
    
    if (!inAssetSection) continue;
    
    // Try to parse asset line
    // Very simplified - real parsing would need more sophisticated logic
    const parts = line.split(/\s{2,}|\t/);
    if (parts.length >= 2) {
      const description = parts[0].trim();
      if (description.length > 5 && !description.match(/^[A-Z\s]+$/)) {
        assets.push({
          description,
          type: detectAssetType(description),
          valueRange: parseValueRange(parts[1] || ""),
          incomeType: parts[2]?.trim() || null,
          incomeRange: parts[3] ? parseValueRange(parts[3]) : null,
        });
      }
    }
  }
  
  return assets;
}

function detectAssetType(description: string): string {
  const lower = description.toLowerCase();
  
  if (lower.includes("stock") || lower.match(/\b(aapl|goog|msft|amzn)\b/i)) {
    return "Stock";
  }
  if (lower.includes("mutual fund") || lower.includes("vanguard") || lower.includes("fidelity")) {
    return "Mutual Fund";
  }
  if (lower.includes("real estate") || lower.includes("property") || lower.includes("land")) {
    return "Real Estate";
  }
  if (lower.includes("retirement") || lower.includes("401k") || lower.includes("ira")) {
    return "Retirement Account";
  }
  if (lower.includes("bond") || lower.includes("treasury")) {
    return "Bond";
  }
  if (lower.includes("bank") || lower.includes("checking") || lower.includes("savings")) {
    return "Bank Account";
  }
  
  return "Other";
}

function calculateNetWorth(assets: Asset[], liabilities: Asset[]): AssetRange {
  let minTotal = 0;
  let maxTotal = 0;
  
  for (const asset of assets) {
    minTotal += asset.valueRange.min;
    maxTotal += asset.valueRange.max;
  }
  
  for (const liability of liabilities) {
    minTotal -= liability.valueRange.max; // Worst case
    maxTotal -= liability.valueRange.min; // Best case
  }
  
  return { min: Math.max(0, minTotal), max: maxTotal };
}

async function processDisclosure(
  pdfPath: string,
  bioguideId: string,
  name: string,
  year: number,
  chamber: "House" | "Senate"
): Promise<FinancialDisclosure> {
  console.log(`Processing: ${name} (${year})`);
  
  const text = await parsePDF(pdfPath);
  const assets = extractAssets(text);
  
  // For now, simplified - real implementation would extract liabilities too
  const liabilities: Asset[] = [];
  const transactions: FinancialDisclosure["transactions"] = [];
  
  return {
    bioguide_id: bioguideId,
    name,
    year,
    filing_date: new Date().toISOString().split("T")[0],
    chamber,
    assets,
    liabilities,
    transactions,
    estimated_net_worth: calculateNetWorth(assets, liabilities),
  };
}

async function main() {
  console.log("💰 Financial Disclosure Parser\n");
  
  // Ensure directories exist
  fs.mkdirSync(PDF_DIR, { recursive: true });
  
  // Check for PDFs to process
  const pdfFiles = fs.existsSync(PDF_DIR) 
    ? fs.readdirSync(PDF_DIR).filter(f => f.endsWith(".pdf"))
    : [];
  
  if (pdfFiles.length === 0) {
    console.log("No PDF files found in .cache/disclosures/");
    console.log("\nTo use this tool:");
    console.log("1. Download disclosure PDFs from:");
    console.log("   - Senate: https://efdsearch.senate.gov/search/");
    console.log("   - House: https://disclosures-clerk.house.gov/FinancialDisclosure");
    console.log("2. Save them to .cache/disclosures/");
    console.log("3. Name format: BIOGUIDE_YEAR.pdf (e.g., P000197_2023.pdf)");
    console.log("\nRun again after adding PDFs.");
    return;
  }
  
  console.log(`Found ${pdfFiles.length} PDF files to process\n`);
  
  const disclosures: FinancialDisclosure[] = [];
  
  for (const file of pdfFiles) {
    // Parse filename: BIOGUIDE_YEAR.pdf
    const match = file.match(/^([A-Z]\d{6})_(\d{4})\.pdf$/);
    if (!match) {
      console.warn(`Skipping ${file} - invalid filename format`);
      continue;
    }
    
    const [, bioguideId, yearStr] = match;
    const year = parseInt(yearStr);
    
    try {
      const disclosure = await processDisclosure(
        path.join(PDF_DIR, file),
        bioguideId,
        bioguideId, // Would need to lookup name
        year,
        "House" // Would need to detect
      );
      disclosures.push(disclosure);
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
    }
  }
  
  if (disclosures.length > 0) {
    const outputPath = path.join(DATA_DIR, "financial-disclosures.json");
    fs.writeFileSync(outputPath, JSON.stringify(disclosures, null, 2));
    console.log(`\n💾 Saved ${disclosures.length} disclosures to ${outputPath}`);
  }
}

main().catch(console.error);
