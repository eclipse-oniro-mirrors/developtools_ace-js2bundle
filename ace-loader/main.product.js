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

var path = require('path')
var fs = require('fs')
var shell = require('shelljs')

const red = '\u001b[31m';
const reset = '\u001b[39m';

function deleteFolderRecursive(url) {
  let files = [];
  if (fs.existsSync(url)) {
    files = fs.readdirSync(url);
    files.forEach(function(file) {
      const curPath = path.join(url, file);
      if (fs.statSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdir(url, function(err) {});
  }
}

function readManifest(manifestFilePath) {
  let manifest = {};
  try {
    if (fs.existsSync(manifestFilePath)) {
      const jsonString = fs.readFileSync(manifestFilePath).toString();
      manifest = JSON.parse(jsonString);
    }
  } catch (e) {
    throw Error('\u001b[31m' + 'ERROR: the manifest.json file format is invalid.' +
      '\u001b[39m').message;
  }
  return manifest;
}

function loadEntryObj(projectPath, device_level, abilityType, manifestFilePath) {
  let entryObj = {};
  switch (abilityType) {
    case 'page':
      const appJSPath = path.resolve(projectPath, 'app.js');
      if (device_level === 'card') {
        entryObj = addPageEntryObj(readManifest(manifestFilePath), projectPath);
      } else {
        if (!fs.existsSync(appJSPath)) {
          throw Error(red + 'ERROR: missing app.js' + reset).message;
        }
        entryObj['./app'] = path.resolve(projectPath, './app.js?entry');
      }
      break;
    case 'form':
      entryObj = addPageEntryObj(readManifest(manifestFilePath), projectPath);
      entryObj[`./${abilityType}`] =  path.resolve(projectPath, `./${abilityType}.js?entry`);
      break;
    default:
      entryObj[`./${abilityType}`] =  path.resolve(projectPath, `./${abilityType}.js?entry`);
      break;
  }
  return entryObj;
}

function addPageEntryObj(manifest, projectPath) {
  let entryObj = {};
  const pages = manifest.pages;
  if (pages === undefined) {
    throw Error('ERROR: missing pages').message;
  }
  pages.forEach((element) => {
    const sourcePath = element;
    const hmlPath = path.join(projectPath, sourcePath + '.hml');
    const aceSuperVisualPath = process.env.aceSuperVisualPath || '';
    const visualPath = path.join(aceSuperVisualPath, sourcePath + '.visual');
    const isHml = fs.existsSync(hmlPath);
    const isVisual = fs.existsSync(visualPath);
    if (isHml && isVisual) {
      throw Error(red + 'ERROR: ' + sourcePath + ' cannot both have hml && visual').message;
    } else if (isHml) {
      entryObj['./' + element] = path.resolve(projectPath, './' + sourcePath + '.hml?entry');
    } else if (isVisual) {
      entryObj['./' + element] = path.resolve(aceSuperVisualPath, './' + sourcePath +
        '.visual?entry');
    }
  })
  return entryObj;
}

function compileCardModule(env) {
  if (process.env.aceModuleJsonPath && fs.existsSync(process.env.aceModuleJsonPath)) {
    const moduleJsonConfig = JSON.parse(fs.readFileSync(process.env.aceModuleJsonPath).toString());
    if (moduleJsonConfig.module && moduleJsonConfig.module.uiSyntax === 'ets') {
      process.env.DEVICE_LEVEL = 'card';
    } else if (validateCardModule(moduleJsonConfig) && !process.env.compileCardModule) {
      process.env.compileCardModule = true;
      const cmd = `webpack --config webpack.rich.config.js --env compilerType=${env.compilerType} ` +
        `DEVICE_LEVEL=card aceModuleRoot=${process.env.projectPath} ` +
        `aceModuleJsonPath=${process.env.aceModuleJsonPath} aceProfilePath=${process.env.aceProfilePath} ` +
        `watchMode=${process.env.watchMode} cachePath=${process.env.cachePath} ` +
        `aceModuleBuild=${process.env.buildPath}`;
      shell.exec(cmd, (err) => {
        if (err) {
          throw Error(err).message;
        }
      })
    }
  }
}

function validateCardModule(moduleJsonConfig) {
  if (moduleJsonConfig.module && moduleJsonConfig.module.extensionAbilities) {
    for (let i = 0; i < moduleJsonConfig.module.extensionAbilities.length; i++) {
      const extensionAbility = moduleJsonConfig.module.extensionAbilities[i];
      if (extensionAbility.type && extensionAbility.type === 'form') {
        return true;
      }
    }
  }
  return false;
}

module.exports = {
  deleteFolderRecursive: deleteFolderRecursive,
  readManifest: readManifest,
  loadEntryObj: loadEntryObj,
  compileCardModule: compileCardModule
};