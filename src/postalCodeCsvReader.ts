import fs from "fs";
import iconv from "iconv-lite";
import parse from "csv-parse/lib/sync";

/**
 * 全国地方公共団体コード（JIS X0401、X0402）………　半角数字
 * （旧）郵便番号（5桁）………………………………………　半角数字
 * 郵便番号（7桁）………………………………………　半角数字
 * 都道府県名　…………　半角カタカナ（コード順に掲載）　（注1）
 * 市区町村名　…………　半角カタカナ（コード順に掲載）　（注1）
 * 町域名　………………　半角カタカナ（五十音順に掲載）　（注1）
 * 都道府県名　…………　漢字（コード順に掲載）　（注1,2）
 * 市区町村名　…………　漢字（コード順に掲載）　（注1,2）
 * 町域名　………………　漢字（五十音順に掲載）　（注1,2）
 * 一町域が二以上の郵便番号で表される場合の表示　（注3）　（「1」は該当、「0」は該当せず）
 * 小字毎に番地が起番されている町域の表示　（注4）　（「1」は該当、「0」は該当せず）
 * 丁目を有する町域の場合の表示　（「1」は該当、「0」は該当せず）
 * 一つの郵便番号で二以上の町域を表す場合の表示　（注5）　（「1」は該当、「0」は該当せず）
 * 更新の表示（注6）（「0」は変更なし、「1」は変更あり、「2」廃止（廃止データのみ使用））
 * 変更理由　（「0」は変更なし、「1」市政・区政・町政・分区・政令指定都市施行、「2」住居表示の実施、「3」区画整理、「4」郵便区調整等、「5」訂正、「6」廃止（廃止データのみ使用））
 */
export interface PostalCodeCsvRow {
  code: string;
  _postalCode5: string;
  postalCode: string;
  prefectureKatakana: string;
  cityKatakana: string;
  townKatakana: string;
  prefecture: string;
  city: string;
  town: string;
  etc1: string;
  etc2: string;
  etc3: string;
  etc4: string;
  etc5: string;
  etc6: string;
}

const Columns = [
  "code",
  "_postalCode5",
  "postalCode",
  "prefectureKatakana",
  "cityKatakana",
  "townKatakana",
  "prefecture",
  "city",
  "town",
  "etc1",
  "etc2",
  "etc3",
  "etc4",
  "etc5",
  "etc6",
];

export class PostalCodeCsvReader {
  static read(path: string): PostalCodeCsvRow[] {
    const raw = fs.readFileSync(path);
    const decoded = iconv.decode(raw, "Shift_JIS");
    return parse(decoded, { columns: Columns });
  }
}
