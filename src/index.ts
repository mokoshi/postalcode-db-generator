import { Command } from "commander";
import { generatePostalCodeMap } from "./generator";
import fs from "fs";

interface Options {
  output: string;
}

const command = new Command();
command.option("-o, --output <output>", "出力ファイル名", "out.json");
command.parse(process.argv);
const options = command.opts<Options>();

const map = generatePostalCodeMap(
  "./original_csv/11SAITAM.CSV",
  "./original_csv/11219_2020.csv"
);

fs.writeFileSync(options.output, JSON.stringify(map, null, 2));
