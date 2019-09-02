import * as fs from "fs";
import * as path from "path";

export class FsCommonUtil {
  constructor() {}

  writeFileIfNotExist(fileWithPath: string, contents: string) {
    if (!fs.existsSync(fileWithPath)) {
      var options = options || {};
      options.flag = "wx";
      fs.writeFileSync(fileWithPath, contents, options);
    }
  }

  checkAndCreateDestinationPath(dir) {
    if (fs.existsSync(dir)) {
        return;
      }
      try {
        fs.mkdirSync(dir);
      } catch (err) {
        if (err.code==="ENOENT") {
            this.checkAndCreateDestinationPath(path.dirname(dir)); //create parent dir
            this.checkAndCreateDestinationPath(dir); //create dir
        }
      }
  }

  readFileAsJson(jsonPath) {
    return JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  }
}