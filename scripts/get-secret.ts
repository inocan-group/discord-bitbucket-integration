// tslint:disable:no-implicit-dependencies
import chalk from "chalk";
import { asyncExec } from "async-shelljs";
import yaml from "js-yaml";
import { parseArgv } from "./lib/util";
import { IServerlessConfig } from "common-types";
import { readFileSync } from "fs";
import { gzip } from "zlib";
import { promisify } from "util";
import { listSecrets } from "./lib/aws-ssm";
const gzipAsync = promisify<Buffer, Buffer>(gzip);

const { params, options } = parseArgv()("--region", "--profile", "--key");
const [param, value] = params;
const config: IServerlessConfig = yaml.safeLoad(
  readFileSync("./serverless.yml", { encoding: "utf-8" })
);

const profile = options.profile || config.provider.profile || "default";
const region = options.region || config.provider.region || "us-east-1";

(async () => {
  try {
    if (!param) {
      console.log(
        `You must state a variable name: ${chalk.grey("yarn get-secret [VAR]")}`
      );
      console.log();
      console.log(`Variables in the "${profile}" AWS profile include:`);
      const secrets = await listSecrets();
      console.log();
      console.log(secrets.map(i => `  > ${i.Name}`).join("\n"));
      console.log();

      process.exit();
    }

    console.log(
      `Using the AWS ${chalk.bold.green(profile)} profile to get ${chalk.bold.green(
        param
      )} in the ${chalk.bold.green(region)} region${
        options.compress ? " [ compressed ]" : ""
      }.`
    );
    const key = options.key ? `--key ${options.key}` : "";
    const valueToSet: string = options.decompress
      ? ((await gzipAsync(Buffer.from(value))) as Buffer).toString("utf-8")
      : value;
    const command = `aws --profile ${profile} --region ${region} ssm get-parameters --names ${param} `;
    console.log(chalk.grey.dim(`> ${command}`));

    const results = await asyncExec(`${command}`, { silent: true });
    console.log(
      options.v || options.verbose ? results : JSON.parse(results).Parameters[0].Value
    );
  } catch (e) {
    if (e.message.indexOf("ParameterAlreadyExists") !== -1) {
      console.log(
        `The parameter ${chalk.yellow.bold(params[0])} is ${chalk.italic(
          "already set" + chalk.reset(".")
        )} To overwrite the value you must use the "-o" or "--overwrite" flag.`
      );
      process.exit(0);
    } else {
      console.error(e.message);
    }
  }
})();
