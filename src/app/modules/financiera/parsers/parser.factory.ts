import { DaviviendaExcelParser } from './davivienda-excel.parser';
import { BancolombiaCsvParser } from './bancolombia-csv.parser';
import { BankStatementParser } from './parser.interface';

const PARSERS: BankStatementParser[] = [
  new DaviviendaExcelParser(),
  new BancolombiaCsvParser(),
];

export function getParserFor(fileName: string): BankStatementParser | null {
  const nameLower = fileName.toLowerCase();
  const ext = (nameLower.split('.').pop() || '').toLowerCase();
  return PARSERS.find(p => p.canParse(nameLower, ext)) ?? null;
}
