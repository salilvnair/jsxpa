import { JsxElectronUtil } from '@salilvnair/jsx-electron';
import { NeDBConfig } from "../model/nedb-config.model";
import * as NeDBConstant from "../constant/nedb.constant";
import * as JsxpaConstant from "../../../constant/jsxpa.constant";
import { FsCommonUtil } from "../util/fs-common.util";

export class NeDBConnectionManager {
  private jsxElectronUtil:JsxElectronUtil;
  private fsCommonUtil: FsCommonUtil;
  private path: any;
  private nedb: any;
  constructor() {
    this.jsxElectronUtil = new JsxElectronUtil();
    this.fsCommonUtil = new FsCommonUtil(this.jsxElectronUtil);
    this.path = this.jsxElectronUtil.remote.require('path');
    this.nedb = this.jsxElectronUtil.remote.require('nedb');
  }
  getInstance() {
    return this.getDefinedInstance(
      NeDBConstant.NEDB_CONFIG_DATABASE_FOLDER_NAME,
      NeDBConstant.NEDB_CONFIG_DEFAULT_DB_FILE_NAME
    );
  }

  getDefinedInstance(databaseFolderName: string, databaseFileName: string) {

    var pathDetail =this.path.join(
      process.cwd(),
      JsxpaConstant.JSXPA_FOLDER_NAME,
      NeDBConstant.NEDB_HOME_FOLDER_NAME,
      databaseFolderName,
      databaseFileName + NeDBConstant.NEDB_DATABASE_FILENAME_EXTENSTION
    );
    var Datastore =this.nedb;
    var dbSourceInstance = new Datastore({
      filename: pathDetail,
      autoload: true
    });
    return dbSourceInstance;
  }

  getInMemoryInstance() {
    var Datastore =this.nedb;
    var dbSourceInstance = new Datastore();
    return dbSourceInstance;
  }

  public getNeDBConfig(): NeDBConfig {
    var configPathDetail =this.path.join(
      process.cwd(),
      JsxpaConstant.JSXPA_FOLDER_NAME,
      NeDBConstant.NEDB_HOME_FOLDER_NAME,
      JsxpaConstant.JSXPA_SUBFOLDER_CONFIG,
      JsxpaConstant.JSXPA_PROVIDER_CONFIG_NEDB
    );
    var basePath =this.path.join(
      process.cwd(),
      JsxpaConstant.JSXPA_FOLDER_NAME,
      NeDBConstant.NEDB_HOME_FOLDER_NAME,
      JsxpaConstant.JSXPA_SUBFOLDER_CONFIG
    );
    this.fsCommonUtil.checkAndCreateDestinationPath(basePath);
    var nedbBasicConfig = {
      applicationName: "your_app",
      createExplicitDB: true,
      inMemoryDB: false
    };
    var nedbBasicConfigString = JSON.stringify(nedbBasicConfig);
    this.fsCommonUtil.writeFileIfNotExist(configPathDetail, nedbBasicConfigString);
    return this.fsCommonUtil.readFileAsJson(configPathDetail);
  }
}