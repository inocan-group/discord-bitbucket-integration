// tslint:disable:no-implicit-dependencies
import chalk from "chalk";
import { asyncExec } from "async-shelljs";
import yaml from "js-yaml";
import { parseArgv } from "./lib/util";
import { IServerlessConfig, IDictionary } from "common-types";
import { readFileSync } from "fs";

const commandLine: string[] = process.argv.slice(2);
const { params, options } = parseArgv("--json")("--region", "--profile");
const config: IServerlessConfig = yaml.safeLoad(
  readFileSync("./serverless.yml", { encoding: "utf-8" })
);

const profile = options.profile || config.provider.profile || "default";
const type = options.type || "String";
const region = options.region || config.provider.region || "us-east-1";

console.log(
  `Using the AWS ${chalk.bold.green(profile)} profile in the ${chalk.bold.green(
    region
  )} region to ${chalk.bold("list")} all parameters in ssm.`
);

(async () => {
  try {
    const command = `aws --profile ${profile} --region ${region} ssm describe-parameters`;
    console.log(chalk.grey.dim(`> ${command}\n`));

    const results: string = await asyncExec(command, { silent: true });
    if (options.json) {
      console.log(JSON.parse(results).Parameters);
    } else {
      JSON.parse(results).Parameters.map((param: IDictionary) => {
        const datetime = new Date(
          Math.round(param.LastModifiedDate * 1000)
        ).toISOString();
        const who = param.LastModifiedUser.split(":").pop();

        console.log(
          `${chalk.green.bold(param.Name)}: ${chalk.italic.grey(
            param.Description
          )}${chalk.reset(" ")}`
        );

        console.log(`  - v${param.Version} of type ${chalk.yellow.bold(param.Type)}`);
        console.log(
          `  - Last modified on ${chalk.bold.yellow(datetime)} by ${chalk.yellow.bold(
            who
          )}`
        );
      });
      console.log();
    }
  } catch (e) {
    console.error(e.message);
    process.exit();
  }
})();
