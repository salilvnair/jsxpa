import { JsxElectronUtil } from '@salilvnair/jsx-electron';


export class FsCommonUtil {
  private jsxElectronUtil;
  path: any;
  fs: any;
  constructor(jsxElectronUtil: JsxElectronUtil) {
    this.jsxElectronUtil = jsxElectronUtil;
    this.path = this.jsxElectronUtil.remote.require('path');
    this.fs = this.jsxElectronUtil.remote.require('fs');
  }

  writeFileIfNotExist(fileWithPath: string, contents: string) {
    if (!this.fs.existsSync(fileWithPath)) {
      var options = options || {};
      options.flag = "wx";
      this.fs.writeFileSync(fileWithPath, contents, options);
    }
  }

  checkAndCreateDestinationPath(dir) {
    if (this.fs.existsSync(dir)) {
        return;
      }
      try {
        this.fs.mkdirSync(dir);
      } catch (err) {
        if (err.code==="ENOENT") {
            this.checkAndCreateDestinationPath(this.path.dirname(dir)); //create parent dir
            this.checkAndCreateDestinationPath(dir); //create dir
        }
      }
  }

  readFileAsJson(jsonPath) {
    return JSON.parse(this.fs.readFileSync(jsonPath, "utf8"));
  }
}