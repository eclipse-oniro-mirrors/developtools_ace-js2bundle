/*
 * Copyright (c) 2021 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const fs = require('fs');
const path = require('path');
const cluster = require('cluster');
const process = require('process');
const crypto = require('crypto');

const forward = '(global.___mainEntry___ = function (globalObjects) {' + '\n' +
              '  var define = globalObjects.define;' + '\n' +
              '  var require = globalObjects.require;' + '\n' +
              '  var bootstrap = globalObjects.bootstrap;' + '\n' +
              '  var register = globalObjects.register;' + '\n' +
              '  var render = globalObjects.render;' + '\n' +
              '  var $app_define$ = globalObjects.$app_define$;' + '\n' +
              '  var $app_bootstrap$ = globalObjects.$app_bootstrap$;' + '\n' +
              '  var $app_require$ = globalObjects.$app_require$;' + '\n' +
              '  var history = globalObjects.history;' + '\n' +
              '  var Image = globalObjects.Image;' + '\n' +
              '  var OffscreenCanvas = globalObjects.OffscreenCanvas;' + '\n' +
              '  (function(global) {' + '\n' +
              '    "use strict";' + '\n';
const last = '\n' + '})(this.__appProto__);' + '\n' + '})';
const firstFileEXT = '_.js';
const genAbcScript = 'gen-abc.js';
let output;
let isWin = false;
let isMac = false;
let isDebug = false;
let arkDir;
let nodeJs;
let intermediateJsBundle = [];
let workerFile = null;
let fileterIntermediateJsBundle = [];
let hashJsonObject = {};
let buildPathInfo = "";
const SUCCESS = 0;
const FAIL = 1;
const red = '\u001b[31m';
const reset = '\u001b[39m';
const blue = '\u001b[34m';
const hashFile = 'gen_hash.json';
const ARK = '/ark/';
let delayCount = 0;
const TS2ABC = 'ts2abc';
const ES2ABC = 'es2abc';

class GenAbcPlugin {
  constructor(output_, arkDir_, nodeJs_, workerFile_, isDebug_) {
    output = output_;
    arkDir = arkDir_;
    nodeJs = nodeJs_;
    isDebug = isDebug_;
    workerFile = workerFile_;
  }
  apply(compiler) {
    if (fs.existsSync(path.resolve(arkDir, 'build-win'))) {
      isWin = true;
    } else if (fs.existsSync(path.resolve(arkDir, 'build-mac'))) {
      isMac = true;
    } else if (!fs.existsSync(path.resolve(arkDir, 'build'))) {
      console.error(red, 'ERROR find build fail', reset);
      process.exitCode = FAIL;
      return;
    }

    compiler.hooks.emit.tap('GenAbcPlugin', (compilation) => {
      const assets = compilation.assets;
      const keys = Object.keys(assets);
      keys.forEach(key => {
        // choice *.js
        if (output && path.extname(key) === '.js') {
          let newContent = assets[key].source();
          if (checkWorksFile(key, workerFile) && key !== 'commons.js' && key !== 'vendors.js') {
            newContent = forward + newContent + last;
          }
          if (key === 'commons.js' || key === 'vendors.js' || !checkWorksFile(key, workerFile)) {
            newContent = `\n\n\n\n\n\n\n\n\n\n\n\n\n\n` + newContent;
          }
          const keyPath = key.replace(/\.js$/, firstFileEXT)
          writeFileSync(newContent, path.resolve(output, keyPath), key, true);
        } else if (output && path.extname(key) === '.json' &&
          process.env.DEVICE_LEVEL === 'card' && !checkI18n(key)) {
          writeFileSync(assets[key].source(), path.resolve(output, key), key, false);
        }
      })
    });
    compiler.hooks.afterEmit.tap('GenAbcPluginMultiThread', () => {
      buildPathInfo = output;
      judgeWorkersToGenAbc(invokeWorkerToGenAbc);
    });
  }
}

function checkI18n(key) {
  const outI18nPath = path.resolve(output, 'i18n', key);
  const projectI18nPath = outI18nPath.replace(output, process.env.projectPath);
  if (fs.existsSync(projectI18nPath)) {
    return true;
  }
  return false;
}

function checkWorksFile(assetPath, workerFile) {
  if (workerFile === null) {
    if (assetPath.search("./workers/") !== 0) {
      return true;
    } else {
      return false;
    }
  } else {
    for (const key in workerFile) {
      let keyExt = key + '.js';
      if (keyExt === assetPath) {
        return false;
      }
    }
  }

  return true;
}

function writeFileSync(inputString, output, jsBundleFile, isToBin) {
    const parent = path.join(output, '..');
    if (!(fs.existsSync(parent) && fs.statSync(parent).isDirectory())) {
        mkDir(parent);
    }
    fs.writeFileSync(output, inputString);
    if (!isToBin) {
      return;
    }
    if (fs.existsSync(output)) {
      let fileSize = fs.statSync(output).size;
      intermediateJsBundle.push({path: output, size: fileSize});
    } else {
      console.error(red, `ERROR Failed to convert file ${jsBundleFile} to bin. ${output} is lost`, reset);
      process.exitCode = FAIL;
    }
}

function mkDir(path_) {
    const parent = path.join(path_, '..');
    if (!(fs.existsSync(parent) && !fs.statSync(parent).isFile())) {
        mkDir(parent);
    }
    fs.mkdirSync(path_);
}

function getSmallestSizeGroup(groupSize) {
  let groupSizeArray = Array.from(groupSize);
  groupSizeArray.sort(function(g1, g2) {
    return g1[1] - g2[1]; // sort by size
  });
  return groupSizeArray[0][0];
}

function splitJsBundlesBySize(bundleArray, groupNumber) {
  let result = [];
  if (bundleArray.length < groupNumber) {
    for (let value of bundleArray) {
      result.push([value]);
    }
    return result;
  }

  bundleArray.sort(function(f1, f2) {
    return f2.size - f1.size;
  });
  let groupFileSize = new Map();
  for (let i = 0; i < groupNumber; ++i) {
    result.push([]);
    groupFileSize.set(i, 0);
  }

  let index = 0;
  while(index < bundleArray.length) {
    let smallestGroup = getSmallestSizeGroup(groupFileSize);
    result[smallestGroup].push(bundleArray[index]);
    let sizeUpdate = groupFileSize.get(smallestGroup) + bundleArray[index].size;
    groupFileSize.set(smallestGroup, sizeUpdate);
    index++;
  }
  return result;
}

function invokeWorkerToGenAbc() {
  let param = '';
  let cmdPrefix = '';

  if (process.env.panda === TS2ABC) {
    if (isDebug) {
      param += ' --debug';
    }

    let js2abc = path.join(arkDir, 'build', 'src', 'index.js');
    if (isWin) {
      js2abc = path.join(arkDir, 'build-win', 'src', 'index.js');
    } else if (isMac) {
      js2abc = path.join(arkDir, 'build-mac', 'src', 'index.js');
    }
    cmdPrefix = `${nodeJs} --expose-gc "${js2abc}" ${param} `;
  } else if (process.env.panda === ES2ABC  || process.env.panda === 'undefined' || process.env.panda === undefined) {
    if (isDebug) {
      param += ' --debug-info';
    }
    let es2abc = path.join(arkDir, 'build', 'bin', 'es2abc');
    if (isWin) {
      es2abc = path.join(arkDir, 'build-win', 'bin', 'es2abc.exe');
    } else if (isMac) {
      es2abc = path.join(arkDir, 'build-mac', 'bin', 'es2abc');
    }
    cmdPrefix = `"${es2abc}" ${param} `;
  } else {
    console.error(red, `ERROR please set panda module`, reset);
  }

  filterIntermediateJsBundleByHashJson(buildPathInfo, intermediateJsBundle);
  const maxWorkerNumber = 3;
  const splitedBundles = splitJsBundlesBySize(fileterIntermediateJsBundle, maxWorkerNumber);
  const workerNumber = maxWorkerNumber < splitedBundles.length ? maxWorkerNumber : splitedBundles.length;

  const clusterNewApiVersion = 16;
  const currentNodeVersion = parseInt(process.version.split('.')[0]);
  const useNewApi = currentNodeVersion >= clusterNewApiVersion ? true : false;

  if ((useNewApi && cluster.isPrimary) || (!useNewApi && cluster.isMaster)) {
    if (useNewApi) {
      cluster.setupPrimary({
        exec: path.resolve(__dirname, genAbcScript)
      });
    } else {
      cluster.setupMaster({
        exec: path.resolve(__dirname, genAbcScript)
      });
    }

    for (let i = 0; i < workerNumber; ++i) {
      let workerData = {
        "inputs": JSON.stringify(splitedBundles[i]),
        "cmd": cmdPrefix
      }
      cluster.fork(workerData);
    }

    let count_ = 0;
    cluster.on('exit', (worker, code, signal) => {
      if (code === FAIL || process.exitCode === FAIL) {
        process.exitCode = FAIL;
        return;
      }
      count_++;
      if (count_ === workerNumber) {
        writeHashJson();
        clearGlobalInfo();
        if (process.env.isPreview) {
          console.log(blue, 'COMPILE RESULT:SUCCESS ', reset);
        }
      }
    });
    process.on('exit', (code) => {
      intermediateJsBundle.forEach((item) => {
        let input = item.path;
        if (fs.existsSync(input)) {
          fs.unlinkSync(input);
        }
      })
    });
  }
}

function clearGlobalInfo() {
  if (!process.env.isPreview) {
    intermediateJsBundle = [];
  }
  fileterIntermediateJsBundle = [];
  hashJsonObject = {};
}

function filterIntermediateJsBundleByHashJson(buildPath, inputPaths) {
  let tempInputPaths = [];
  inputPaths.forEach((item) => {
    let check = tempInputPaths.every((newItem) => {
      return item.path !== newItem.path;
    });
    if (check) {
      tempInputPaths.push(item);
    }
  });
  inputPaths = tempInputPaths;

  for (let i = 0; i < inputPaths.length; ++i) {
    fileterIntermediateJsBundle.push(inputPaths[i]);
  }
  const hashFilePath = genHashJsonPath(buildPath);
  if (hashFilePath.length == 0) {
    return ;
  }
  let updateJsonObject = {};
  let jsonObject = {};
  let jsonFile = "";
  if (fs.existsSync(hashFilePath)) {
    jsonFile = fs.readFileSync(hashFilePath).toString();
    jsonObject = JSON.parse(jsonFile);
    fileterIntermediateJsBundle = [];
    for (let i = 0; i < inputPaths.length; ++i) {
      let input = inputPaths[i].path;
      let abcPath = input.replace(/_.js$/, '.abc');

      if (!fs.existsSync(input)) {
        console.error(red, `ERROR ${input} is lost`, reset);
        process.exitCode = FAIL;
        break;
      }

      if (fs.existsSync(input) && fs.existsSync(abcPath)) {
        const hashInputContentData = toHashData(input);
        const hashAbcContentData = toHashData(abcPath);
        if (jsonObject[input] === hashInputContentData && jsonObject[abcPath] === hashAbcContentData) {
          updateJsonObject[input] = hashInputContentData;
          updateJsonObject[abcPath] = hashAbcContentData;
          if (!process.env.isPreview) {
            fs.unlinkSync(input);
          }
        } else {
          fileterIntermediateJsBundle.push(inputPaths[i]);
        }
      } else {
        fileterIntermediateJsBundle.push(inputPaths[i]);
      }
    }
  }

  hashJsonObject = updateJsonObject;
}

function writeHashJson() {
  for (let i = 0; i < fileterIntermediateJsBundle.length; ++i) {
    let input = fileterIntermediateJsBundle[i].path;
    let abcPath = input.replace(/_.js$/, '.abc');
    if (!fs.existsSync(input) || !fs.existsSync(abcPath)) {
      console.error(red, `ERROR ${input} is lost`, reset);
      process.exitCode = FAIL;
      break;
    }
    if (fs.existsSync(input) && fs.existsSync(abcPath)) {
      const hashInputContentData = toHashData(input);
      const hashAbcContentData = toHashData(abcPath);
      hashJsonObject[input] = hashInputContentData;
      hashJsonObject[abcPath] = hashAbcContentData;
    }
    if (!process.env.isPreview && fs.existsSync(input)) {
      fs.unlinkSync(input);
    }
  }
  const hashFilePath = genHashJsonPath(buildPathInfo);
  if (hashFilePath.length == 0) {
    return ;
  }
  if (!process.env.isPreview || delayCount < 1) {
    fs.writeFileSync(hashFilePath, JSON.stringify(hashJsonObject));
  }
}

function genHashJsonPath(buildPath) {
  buildPath = toUnixPath(buildPath);
  if (process.env.cachePath) {
    if (!fs.existsSync(process.env.cachePath) || !fs.statSync(process.env.cachePath).isDirectory()) {
      return '';
    }
    return path.join(process.env.cachePath, hashFile);
  } else if (buildPath.indexOf(ARK) >= 0) {
    const dataTmps = buildPath.split(ARK);
    const hashPath = path.join(dataTmps[0], ARK);
    if (!fs.existsSync(hashPath) || !fs.statSync(hashPath).isDirectory()) {
      return '';
    }
    return path.join(hashPath, hashFile);
  } else {
    return '';
  }
}

function toUnixPath(data) {
  if (/^win/.test(require('os').platform())) {
    const fileTmps = data.split(path.sep);
    const newData = path.posix.join(...fileTmps);
    return newData;
  }
  return data;
}

function toHashData(path) {
  const content = fs.readFileSync(path);
  const hash = crypto.createHash('sha256');
  hash.update(content);
  return hash.digest('hex');
}

module.exports = {
  GenAbcPlugin: GenAbcPlugin,
  checkWorksFile: checkWorksFile
}

function judgeWorkersToGenAbc(callback) {
  const workerNumber = Object.keys(cluster.workers).length;
  if (workerNumber === 0) {
    callback();
    return ;
  } else {
    delayCount++;
    setTimeout(judgeWorkersToGenAbc.bind(null, callback), 50);
  }
}
