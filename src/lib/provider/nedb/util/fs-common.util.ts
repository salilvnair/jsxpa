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

  checkAndCreateDestinationPath(fileDestination:string) {
    this._forceCreateDir(fileDestination);
  }

  _forceCreateDir(dir:string) {
    if (this.fs.existsSync(dir)) {
      return;
    }
    try {
      this.fs.mkdirSync(dir);
    } catch (err) {
      if((err+'').indexOf('ENOENT') > -1){
         this._forceCreateDir(this.path.dirname(dir)); //create parent dir
         this._forceCreateDir(dir); //create dir
      }
    }
  }

  readFileAsJson(jsonPath) {
    return JSON.parse(this.fs.readFileSync(jsonPath, "utf8"));
  }
}