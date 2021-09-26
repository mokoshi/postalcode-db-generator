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
    const postalCodeName = `${postalCodeRow.prefecture}${postalCodeRow.city}${postalCodeRow.town}`;

    for (const locationInfoRow of locationInfoRows) {
      const locationInfoName = `${locationInfoRow.prefecture}${locationInfoRow.city}${locationInfoRow.town}`;
      if (locationInfoName.startsWith(postalCodeName)) {
        results.push({
          prefecture: locationInfoRow.prefecture,
          city: locationInfoRow.city,
          town: locationInfoRow.town,
        });
      }
    }

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
