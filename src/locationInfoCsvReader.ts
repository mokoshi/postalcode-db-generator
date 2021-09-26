import fs from "fs";
import iconv from "iconv-lite";
import parse from "csv-parse/lib/sync";

// "都道府県コード","都道府県名","市区町村コード","市区町村名","大字町丁目コード","大字町丁目名","緯度","経度","原典資料コード","大字・字・丁目区分コード"
export interface LocationInfoCsvRow {
  prefectureCode: string;
  prefecture: string;
  cityCode: string;
  city: string;
  townCode: string;
  town: string;
  latitude: string;
  longitude: string;
  etc1: string;
  etc2: string;
}

const Columns = [
  "prefectureCode",
  "prefecture",
  "cityCode",
  "city",
  "townCode",
  "town",
  "latitude",
  "longitude",
  "etc1",
  "etc2",
];

export class LocationInfoCsvReader {
  static read(path: string): LocationInfoCsvRow[] {
    const raw = fs.readFileSync(path);
    const decoded = iconv.decode(raw, "Shift_JIS");
    const trimmed = decoded.substr(decoded.indexOf("\n", 0) + 1);
    return parse(trimmed, { columns: Columns });
  }
}
