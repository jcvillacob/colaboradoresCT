// Quita BOM si existe
export function stripBOM(text: string): string {
  return text.charCodeAt(0) === 0xFEFF ? text.slice(1) : text;
}

// Detecta el delimitador por la primera línea
export function detectDelimiter(headerLine: string): ',' | ';' {
  const commas = (headerLine.match(/,/g) || []).length;
  const semis  = (headerLine.match(/;/g) || []).length;
  return semis > commas ? ';' : ',';
}

// Parser CSV sencillo con comillas
export function parseCSV(text: string): string[][] {
  const src = stripBOM(text).replace(/\r\n/g, '\n');
  const lines = src.split('\n').filter(l => l.trim().length > 0);
  if (!lines.length) return [];
  const delim = detectDelimiter(lines[0]);

  const out: string[][] = [];
  for (const line of lines) {
    const row: string[] = [];
    let cur = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i+1] === '"') { cur += '"'; i++; }
        else inQuotes = !inQuotes;
      } else if (ch === delim && !inQuotes) {
        row.push(cur); cur = '';
      } else {
        cur += ch;
      }
    }
    row.push(cur);
    out.push(row.map(c => c.trim()));
  }
  return out;
}
