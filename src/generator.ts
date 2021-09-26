import { PostalCodeCsvReader } from "./postalCodeCsvReader";
import { LocationInfoCsvReader } from "./locationInfoCsvReader";

interface LocationResult {
  prefecture: string;
  city: string;
  town: string;
}

interface PostalCodeMap {
  [postalCode: string]: LocationResult[];
}

export function generatePostalCodeMap(
  postalCodeCsv: string,
  locationInfoCsv: string,
  targetCity = "上尾市"
): PostalCodeMap {
  const postalCodeRows = PostalCodeCsvReader.read(postalCodeCsv);
  const locationInfoRows = LocationInfoCsvReader.read(locationInfoCsv);

  const map: PostalCodeMap = {};
  for (const postalCodeRow of postalCodeRows) {
    if (postalCodeRow.city !== targetCity) {
      continue;
    }

    const results: LocationResult[] = [];

    // 埼玉県上尾市上尾下
    const regexp = new RegExp(
      `^${postalCodeRow.prefecture}${postalCodeRow.city}(?:大字)?(${postalCodeRow.town}(?:[一二三四五六七八九〇]+丁目)?)$`
    );

    for (const locationInfoRow of locationInfoRows) {
      if (locationInfoRow.city !== targetCity) {
        continue;
      }

      const locationInfoName = `${locationInfoRow.prefecture}${locationInfoRow.city}${locationInfoRow.town}`;
      const match = locationInfoName.match(regexp);
      if (match) {
        results.push({
          prefecture: locationInfoRow.prefecture,
          city: locationInfoRow.city,
          town: match[1],
        });
      }
    }

    results.sort((a, b) =>
      kansuujiToNum(a.town).localeCompare(kansuujiToNum(b.town), "ja")
    );

    map[postalCodeRow.postalCode] =
      results.length === 0
        ? [
            // 位置情報から名前が見つからなかった場合は郵便局のデータだけ入力する
            // "埼玉県上尾市壱丁目" などが該当する...よくわからない
            {
              prefecture: postalCodeRow.prefecture,
              city: postalCodeRow.city,
              town:
                postalCodeRow.town === "以下に掲載がない場合"
                  ? "その他"
                  : postalCodeRow.town,
            },
          ]
        : results;
  }

  return map;
}

function kansuujiToNum(v: string) {
  const map: Record<string, string> = {
    一: "1",
    二: "2",
    三: "3",
    四: "4",
    五: "5",
    六: "6",
    七: "7",
    八: "8",
    九: "9",
    〇: "0",
  };
  return v.replace(/[一二三四五六七八九〇]/g, (c) => {
    return map[c];
  });
}
