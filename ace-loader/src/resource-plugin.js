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
const SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');

const CUSTOM_THEME_PROP_GROUPS = require('./theme/customThemeStyles');
const OHOS_THEME_PROP_GROUPS = require('./theme/ohosStyles');
import { mkDir } from './util';

const FILE_EXT_NAME = ['.js', '.css', '.jsx', '.less', '.sass', '.scss', '.md', '.DS_Store', '.hml', '.json'];
const red = '\u001b[31m';
const reset = '\u001b[39m';
let input = '';
let output = '';
let manifestFilePath = '';
let shareThemePath = '';
let internalThemePath = '';

function copyFile(input, output) {
  try {
    if (fs.existsSync(input)) {
      const parent = path.join(output, '..');
      if (!(fs.existsSync(parent) && fs.statSync(parent).isDirectory())) {
        mkDir(parent);
      }
      const pathInfo = path.parse(input);
      const entryObj = addPageEntryObj();
      const indexPath = pathInfo.dir + path.sep + pathInfo.name + '.hml?entry';
      for (const key in entryObj) {
        if (entryObj[key] === indexPath) {
          return;
        }
      }
      if (pathInfo.ext === '.json' && (pathInfo.dir === shareThemePath ||
        pathInfo.dir === internalThemePath)) {
        if (themeFileBuild(input, output)) {
          return;
        }
      }
      const readStream = fs.createReadStream(input);
      const writeStream = fs.createWriteStream(output);
      readStream.pipe(writeStream);
      readStream.on('close', function() {
        writeStream.end();
      });
    }
  } catch (e) {
    console.error(red, `Failed to build file ${input}.`, reset);
    throw e.message;
  }
}

function circularFile(inputPath, outputPath, ext) {
  const realPath = path.join(inputPath, ext);
  const localI18n = path.join(input, 'i18n');
  if (!fs.existsSync(realPath) || realPath === output || realPath === localI18n) {
    return;
  }
  fs.readdirSync(realPath).forEach(function(file_) {
    const file = path.join(realPath, file_);
    const fileStat = fs.statSync(file);
    if (fileStat.isFile()) {
      const baseName = path.basename(file);
      const extName = path.extname(file);
      if (FILE_EXT_NAME.indexOf(extName) < 0 && baseName !== '.DS_Store') {
        const outputFile = path.join(outputPath, ext, path.basename(file_));
        if (outputFile === path.join(output, 'manifest.json')) {
          return;
        }
        if (fs.existsSync(outputFile)) {
          const outputFileStat = fs.statSync(outputFile);
          if (outputFileStat.isFile() && fileStat.size !== outputFileStat.size) {
            copyFile(file, outputFile);
          }
        } else {
          copyFile(file, outputFile);
        }
      }
    } else if (fileStat.isDirectory()) {
      circularFile(inputPath, outputPath, path.join(ext, file_));
    }
  });
}

class ResourcePlugin {
  constructor(input_, output_, manifestFilePath_) {
    input = input_;
    output = output_;
    manifestFilePath = manifestFilePath_;
    shareThemePath = path.join(input_, '../share/resources/styles');
    internalThemePath = path.join(input_, 'resources/styles');
  }
  apply(compiler) {
    compiler.hooks.beforeCompile.tap('resource Copy', () => {
      circularFile(input, output, '');
      circularFile(input, output, '../share');
    });
    compiler.hooks.normalModuleFactory.tap('OtherEntryOptionPlugin', () => {
      if (process.env.DEVICE_LEVEL === 'card' && process.env.compileMode !== 'moduleJson') {
        return;
      }
      addPageEntryObj();
      entryObj = Object.assign(entryObj, abilityEntryObj);
      for (const key in entryObj) {
        if (!compiler.options.entry[key]) {
          const singleEntry = new SingleEntryPlugin('', entryObj[key], key);
          singleEntry.apply(compiler);
        }
      }
    });
    compiler.hooks.done.tap('copyManifest', () => {
      copyManifest();
      if (fs.existsSync(path.join(output, 'app.js'))) {
        fs.utimesSync(path.join(output, 'app.js'), new Date(), new Date());
      }
    });
  }
}

function copyManifest() {
  copyFile(manifestFilePath, path.join(output, 'manifest.json'));
}

let entryObj = {};

function addPageEntryObj() {
  entryObj = {};
  if (process.env.abilityType === 'page') {
    const jsonString = readManifest(manifestFilePath);
    const pages = jsonString.pages;
    if (pages === undefined) {
      throw Error('ERROR: missing pages').message;
    }
    pages.forEach((element) => {
      const sourcePath = element;
      const hmlPath = path.join(input, sourcePath + '.hml');
      const aceSuperVisualPath = process.env.aceSuperVisualPath || '';
      const visualPath = path.join(aceSuperVisualPath, sourcePath + '.visual');
      const isHml = fs.existsSync(hmlPath);
      const isVisual = fs.existsSync(visualPath);
      const projectPath = process.env.projectPath;
      if (isHml && isVisual) {
        console.error('ERROR: ' + sourcePath + ' cannot both have hml && visual');
      } else if (isHml) {
        entryObj['./' + element] = path.resolve(projectPath, './' + sourcePath + '.hml?entry');
      } else if (isVisual) {
        entryObj['./' + element] = path.resolve(aceSuperVisualPath, './' + sourcePath +
          '.visual?entry');
      }
    });
  }
  if (process.env.isPreview !== 'true' && process.env.DEVICE_LEVEL === 'rich') {
    loadWorker(entryObj);
  }
  return entryObj;
}

let abilityEntryObj = {};
function addAbilityEntryObj(moduleJson) {
  abilityEntryObj = {};
  const entranceFiles = readAbilityEntrance(moduleJson);
  entranceFiles.forEach(filePath => {
    const key = filePath.replace(/^\.\/js\//, './').replace(/\.js$/, '');
    abilityEntryObj[key] = path.resolve(proces.env.projectPath, '../', filePath);
  });
  return abilityEntryObj;
}

function readAbilityEntrance(moduleJson) {
  const entranceFiles = [];
  if (moduleJson.module) {
    if (moduleJson.module.srcEntrance) {
      entranceFiles.push(moduleJson.module.srcEntrance);
    }
    if (moduleJson.module.abilities && moduleJson.module.abilities.length) {
      readEntrances(moduleJson.module.abilities, entranceFiles);
    }
    if (moduleJson.module.extensionAbilities && moduleJson.module.extensionAbilities.length) {
      readEntrances(moduleJson.module.extensionAbilities, entranceFiles);
    }
  }
  return entranceFiles;
}

function readEntrances(abilities, entranceFiles) {
  abilities.forEach(ability => {
    if ((!ability.type || ability.type !== 'form') && ability.srcEntrance) {
      entranceFiles.push(ability.srcEntrance);
    }
  });
}

function readManifest(manifestFilePath) {
  let manifest = {};
  try {
    if (fs.existsSync(manifestFilePath)) {
      const jsonString = fs.readFileSync(manifestFilePath).toString();
      manifest = JSON.parse(jsonString);
    } else if (process.env.aceModuleJsonPath && fs.existsSync(process.env.aceModuleJsonPath)) {
      buildManifest(manifest);
   } else {
    throw Error('\u001b[31m' + 'ERROR: the manifest.json or module.json is lost.' +
      '\u001b[39m').message;
   }
  } catch (e) {
    throw Error('\u001b[31m' + 'ERROR: the manifest.json or module.json file format is invalid.' +
      '\u001b[39m').message;
  }
  return manifest;
}

function readModulePages(moduleJson) {
  if (moduleJson.module.uiSyntax === 'hml' && moduleJson.module.pages) {
    const modulePagePath = path.resolve(process.env.aceProfilePath,
      `${moduleJson.module.pages.replace(/\@profile\:/, '')}.json`);
    if (fs.existsSync(modulePagePath)) {
      const pagesConfig = JSON.parse(fs.readFileSync(modulePagePath, 'utf-8'));
      return pagesConfig.src;
    }
  }
}

function readFormPages(moduleJson) {
  const pages = [];
  if (moduleJson.module.extensionAbilities && moduleJson.module.extensionAbilities.length) {
    moduleJson.module.extensionAbilities.forEach(extensionAbility => {
      if (extensionAbility.type && extensionAbility.type === 'form' && extensionAbility.metadate &&
        extensionAbility.metadate.length) {
        extensionAbility.metadate.forEach(item => {
          if (item.resource && /\@profile\:/.test(item.resource)) {
            parseFormConfig(item.resource, pages);
          }
        });
      }
    });
  }
}

function parseFormConfig(resource, pages) {
  const resourceFile = path.resolve(process.env.aceProfilePath,
    `${resource.replace(/\@profile\:/, '')}.json`);
  if (fs.existsSync(resourceFile)) {
    const pagesConfig = JSON.parse(fs.readFileSync(resourceFile, 'utf-8'));
    if (pagesConfig.forms && pagesConfig.forms.length) {
      pagesConfig.forms.forEach(form => {
        if (form.src) {
          pages.push(form.src);
        }
      });
    }
  }
}

function buildManifest(manifest) {
  try {
    const moduleJson =  JSON.parse(fs.readFileSync(process.env.aceModuleJsonPath).toString());
    if (process.env.DEVICE_LEVEL === 'rich') {
      manifest.pages = readModulePages(moduleJson);
      manifest.abilityEntryObj = addAbilityEntryObj(moduleJson);
    }
    if (process.env.DEVICE_LEVEL === 'card') {
      manifest.pages = readFormPages(moduleJson);
    }
    manifest.minPlatformVersion = configJson.app.apiVersion.compatible;
  } catch (e) {
    throw Error("\x1B[31m" + 'ERROR: the module.json file is lost or format is invalid.' +
      "\x1B[39m").message;
  }
}

function loadWorker(entryObj) {
  const workerPath = path.resolve(input, 'workers');
  if (fs.existsSync(workerPath)) {
    const workerFiles = [];
    readFile(workerPath, workerFiles);
    workerFiles.forEach((item) => {
      if (/\.js$/.test(item)) {
        const relativePath = path.relative(workerPath, item).replace(/\.js$/, '');
        entryObj[`./workers/` + relativePath] = item;
      }
    });
  }
}

function readFile(dir, utFiles) {
  try {
    const files = fs.readdirSync(dir);
    files.forEach((element) => {
      const filePath = path.join(dir, element);
      const status = fs.statSync(filePath);
      if (status.isDirectory()) {
        readFile(filePath, utFiles);
      } else {
        utFiles.push(filePath);
      }
    });
  } catch (e) {
    console.error(e.message);
  }
}

function themeFileBuild(customThemePath, customThemeBuild) {
  if (fs.existsSync(customThemePath)) {
    const themeContent = JSON.parse(fs.readFileSync(customThemePath));
    const newContent = {};
    if (themeContent && themeContent['style']) {
      newContent['style'] = {};
      const styleContent = themeContent['style'];
      Object.keys(styleContent).forEach(function(key) {
        const customKey = CUSTOM_THEME_PROP_GROUPS[key];
        const ohosKey = OHOS_THEME_PROP_GROUPS[key];
        if (ohosKey) {
          newContent['style'][ohosKey] = styleContent[key];
        } else if (customKey) {
          newContent['style'][customKey] = styleContent[key];
        } else {
          newContent['style'][key] = styleContent[key];
        }
      });
      fs.writeFileSync(customThemeBuild, JSON.stringify(newContent, null, 2));
      return true;
    }
  }
  return false;
}

module.exports = ResourcePlugin;