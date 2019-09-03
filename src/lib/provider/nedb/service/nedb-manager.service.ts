import { JsxElectronUtil } from "@salilvnair/jsx-electron";
import { NeDBConfig } from "../model/nedb-config.model";
import * as NeDBConstant from "../constant/nedb.constant";
import * as JsxpaConstant from "../../../constant/jsxpa.constant";
import { FsCommonUtil } from "../util/fs-common.util";

export class NeDBConnectionManager {
  private fsCommonUtil: FsCommonUtil ;
  private jsxElectronUtil:JsxElectronUtil;
  path: any;
  fs: any;
  constructor(
     ) {
      this.jsxElectronUtil = new JsxElectronUtil();
      this.fsCommonUtil = new FsCommonUtil(this.jsxElectronUtil);
      this.path = this.jsxElectronUtil.remote.require("path");
      this.fs = this.jsxElectronUtil.remote.require("fs");
     }
  getInstance() {
    return this.getDefinedInstance(
      NeDBConstant.NEDB_CONFIG_DATABASE_FOLDER_NAME,
      NeDBConstant.NEDB_CONFIG_DEFAULT_DB_FILE_NAME
    );
  }

  getDefinedInstance(databaseFolderName: string,
     databaseFileName: string,
     neDBConfig?:NeDBConfig) {
    var app = this.jsxElectronUtil.remote.require("electron").app;
    var path = this.jsxElectronUtil.remote.require("path");
    var pathDetail:string;
    if(neDBConfig){
      if(neDBConfig.storeInUserHome) {
        let userHome = this.jsxElectronUtil.env().HOME || this.jsxElectronUtil.env().USERPROFILE;
        pathDetail = path.join(
          userHome,
          '.ngpa',
          neDBConfig.applicationName.toLowerCase(),
          JsxpaConstant.JSXPA_FOLDER_NAME,
          NeDBConstant.NEDB_HOME_FOLDER_NAME,
          databaseFolderName,
          databaseFileName + NeDBConstant.NEDB_DATABASE_FILENAME_EXTENSTION
        );
      }
    }
    else{
      pathDetail = path.join(
        app.getAppPath(),
        JsxpaConstant.JSXPA_FOLDER_NAME,
        NeDBConstant.NEDB_HOME_FOLDER_NAME,
        databaseFolderName,
        databaseFileName + NeDBConstant.NEDB_DATABASE_FILENAME_EXTENSTION
      );
    }
    var Datastore = this.jsxElectronUtil.remote.require('nedb');
    var dbSourceInstance = new Datastore({
      filename: pathDetail,
      autoload: true
    });
    return dbSourceInstance;
  }

  getInMemoryInstance() {
    var Datastore = this.jsxElectronUtil.remote.require('nedb');
    var dbSourceInstance = new Datastore();
    return dbSourceInstance;
  }

  public getNeDBConfig(neDBConfig:NeDBConfig): NeDBConfig {
    var app = this.jsxElectronUtil.remote.require("electron").app;
    var path = this.jsxElectronUtil.remote.require("path");
    var configPathDetail:string;
    if(neDBConfig){
      let userHome = this.jsxElectronUtil.env().HOME || this.jsxElectronUtil.env().USERPROFILE;
      if(neDBConfig.storeInUserHome) {
        configPathDetail = path.join(
          userHome,
          '.ngpa',
          neDBConfig.applicationName.toLowerCase(),
          JsxpaConstant.JSXPA_FOLDER_NAME,
          NeDBConstant.NEDB_HOME_FOLDER_NAME,
          JsxpaConstant.JSXPA_SUBFOLDER_CONFIG,
          JsxpaConstant.JSXPA_PROVIDER_CONFIG_NEDB
        );
      }
    }
    else{
      configPathDetail = path.join(
        app.getAppPath(),
        JsxpaConstant.JSXPA_FOLDER_NAME,
        NeDBConstant.NEDB_HOME_FOLDER_NAME,
        JsxpaConstant.JSXPA_SUBFOLDER_CONFIG,
        JsxpaConstant.JSXPA_PROVIDER_CONFIG_NEDB
      );
    }

    var basePath:string;
    if(neDBConfig){
      if(neDBConfig.storeInUserHome) {
        let userHome = this.jsxElectronUtil.env().HOME || this.jsxElectronUtil.env().USERPROFILE;
        basePath = path.join(
          userHome,
          '.ngpa',
          neDBConfig.applicationName.toLowerCase(),
          JsxpaConstant.JSXPA_FOLDER_NAME,
          NeDBConstant.NEDB_HOME_FOLDER_NAME,
          JsxpaConstant.JSXPA_SUBFOLDER_CONFIG
        );
      }
    }
    else{
      basePath = path.join(
        app.getAppPath(),
        JsxpaConstant.JSXPA_FOLDER_NAME,
        NeDBConstant.NEDB_HOME_FOLDER_NAME,
        JsxpaConstant.JSXPA_SUBFOLDER_CONFIG
      );
    }
    this.fsCommonUtil.checkAndCreateDestinationPath(basePath);
    var nedbBasicConfig = {
      applicationName: "your_app",
      createExplicitDB: true,
      inMemoryDB: false,
      storeInUserHome: false
    };
    if(neDBConfig){
      nedbBasicConfig  = neDBConfig;
    }
    var nedbBasicConfigString = JSON.stringify(nedbBasicConfig);
    this.fsCommonUtil.writeFileIfNotExist(configPathDetail, nedbBasicConfigString);
    return this.fsCommonUtil.readFileAsJson(configPathDetail);
  }
}