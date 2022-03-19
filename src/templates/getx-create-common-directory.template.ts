import * as changeCase from "change-case";
import { existsSync, lstatSync, writeFile } from "fs";

// index
export function indexTemplate(pageName: string, targetDirectory: string) {
  const pascalCaseName = changeCase.pascalCase(pageName.toLowerCase());
  const snakeCaseName = changeCase.snakeCase(pageName.toLowerCase());
  const targetPath = `${targetDirectory}/${pageName}/index.dart`;
  const template = `library ${snakeCaseName};

// export './xxxx.dart';
`;

  return new Promise(async (resolve, reject) => {
    writeFile(targetPath, template, "utf8", (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve;
    });
  });
}

// common index
export function commonIndexTemplate(targetDirectory: string) {
  const targetPath = `${targetDirectory}/index.dart`;
  const template = `library common;

export 'api/index.dart';
export 'components/index.dart';
export 'extension/index.dart';
export 'i18n/index.dart';
export 'models/index.dart';
export 'routers/index.dart';
export 'services/index.dart';
export 'style/index.dart';
export 'utils/index.dart';
export 'values/index.dart';
export 'widgets/index.dart';
`;

  return new Promise(async (resolve, reject) => {
    writeFile(targetPath, template, "utf8", (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve;
    });
  });
}
