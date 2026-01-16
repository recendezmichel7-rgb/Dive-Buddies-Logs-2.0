
import { Dive } from '../types';

// Exported SHEET_ID to allow access from other components (e.g., footer in App.tsx)
export const SHEET_ID = '1Xn4HTnQ_i8YgqCD_jdNcO8odXTznGstFVNZzvnoVAX0';
const TAB_NAME = 'Form Responses 1';

/**
 * Fetches Google Sheet data as CSV and parses it into Dive objects.
 * We use the gviz/tq endpoint for reliable CSV export.
 */
export async function fetchDiveData(): Promise<Dive[]> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(TAB_NAME)}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch sheet data');
    
    const csvText = await response.text();
    return parseCSV(csvText);
  } catch (error) {
    console.error('Error fetching dive data:', error);
    return [];
  }
}

function parseCSV(csv: string): Dive[] {
  // Simple CSV parser that handles quoted values containing commas
  const rows: string[][] = [];
  const lines = csv.split(/\r?\n/);
  
  for (let i = 1; i < lines.length; i++) { // Skip header row
    const line = lines[i];
    if (!line.trim()) continue;
    
    const row: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        row.push(current.trim().replace(/^"|"$/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    row.push(current.trim().replace(/^"|"$/g, ''));
    rows.push(row);
  }

  // Mapping based on user request:
  // Col A(0)=Timestamp, B(1)=Date, C(2)=Point Name, D(3)=Dive Time, E(4)=Max Depth, 
  // F(5)=Avg Depth, G(6)=Water Temp, H(7)=Visibility, I(8)=Current, J(9)=Waves, K(10)=Guide
  return rows.map(row => ({
    timestamp: row[0] || '',
    date: row[1] || '',
    pointName: row[2] || 'Unnamed Site',
    diveTime: row[3] || 'N/A',
    maxDepth: row[4] || '0',
    avgDepth: row[5] || '0',
    waterTemp: row[6] || '0',
    visibility: row[7] || 'N/A',
    current: row[8] || 'N/A',
    waves: row[9] || 'N/A',
    guide: row[10] || 'N/A',
  }));
}
