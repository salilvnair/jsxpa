import * as JsxpaConstant from "../../../constant/jsxpa.constant";
import * as NeDBConstant from "../constant/nedb.constant";
import { JsxElectronUtil } from '@salilvnair/jsx-electron';
import { NeDBConfig } from '../model/nedb-config.model';
export class NeDBService<T> {
  private jsxElectronUtil: JsxElectronUtil;
  path: any;
  fs: any;
  private config: NeDBConfig;
  constructor() {
    this.jsxElectronUtil = new JsxElectronUtil();
    this.path = this.jsxElectronUtil.remote.require("path");
    this.fs = this.jsxElectronUtil.remote.require("fs");
  }
  selectAllSync(databaseName: string): T[] {
    var rows: T[] = [];    
    let configPathDetail: string;
    let neDBConfig = this.config; 
    var app = this.jsxElectronUtil.remote.require("electron").app;
    if(neDBConfig){
      if(neDBConfig.storeInUserHome) {
        let userHome = this.jsxElectronUtil.env().HOME || this.jsxElectronUtil.env().USERPROFILE;
        configPathDetail = this.path.join(
          userHome,
          '.ngpa',
          neDBConfig.applicationName.toLowerCase(),
          JsxpaConstant.JSXPA_FOLDER_NAME,
          NeDBConstant.NEDB_HOME_FOLDER_NAME,
          NeDBConstant.NEDB_CONFIG_DATABASE_FOLDER_NAME,
          databaseName + NeDBConstant.NEDB_DATABASE_FILENAME_EXTENSTION
        );
      }
    }
    else {
      configPathDetail = this.path.join(
        app.getAppPath(),
        JsxpaConstant.JSXPA_FOLDER_NAME,
        NeDBConstant.NEDB_HOME_FOLDER_NAME,
        NeDBConstant.NEDB_CONFIG_DATABASE_FOLDER_NAME,
        databaseName + NeDBConstant.NEDB_DATABASE_FILENAME_EXTENSTION
      );
    }

    var data = this.fs.readFileSync(configPathDetail, "utf8");
    if (data == "" || data == null) {
      return rows;
    }
    var arr: string[] = data.trim().split(/\r|\n/);
    arr.forEach(el => {
      var eld = JSON.parse(el);
      rows.push(eld);
    });
    return rows;
  }

  selectOneSync(id: string, databaseName: string): T {
    var row: T = Object.assign(null);
    var rows: T[] = this.selectAllSync(databaseName);
    if (rows.length > 0) {
      rows.find(function(rowItr, index) {
        return rowItr["_id"] === id;
      });
    }
    return row;
  }
  selectOneByColumnSync(columnName: string, columnValue: string, databaseName: string): T {
    var row: T = <T>{};
    var rows: T[] = this.selectAllSync(databaseName);
    if (rows.length > 0) {
      var index = rows.findIndex(rowItr => rowItr[columnName] === columnValue);
      if (index > -1) {
        row = rows[index];
      }
    }
    return row;
  }
}