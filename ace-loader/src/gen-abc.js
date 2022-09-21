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
const childProcess = require('child_process');
const cluster = require('cluster');
const SUCCESS = 0;
const FAIL = 1;
const red = '\u001b[31m';
const reset = '\u001b[39m';
const TS2ABC = 'ts2abc';
const ES2ABC = 'es2abc';

function js2abcByWorkers(jsonInput, cmd) {
  const inputPaths = JSON.parse(jsonInput);
  for (let i = 0; i < inputPaths.length; ++i) {
    let input = inputPaths[i].path;
    let singleCmd = `${cmd} "${input}"`;
    try {
      childProcess.execSync(singleCmd);
    } catch (e) {
      console.error(red, `ERROR Failed to convert file ${input} to abc `, reset);
      process.exit(FAIL);
    }

    const abcFile = input.replace(/\.js$/, '.abc');
    if (fs.existsSync(abcFile)) {
      const abcFileNew = abcFile.replace(/_.abc$/, '.abc');
      fs.copyFileSync(abcFile, abcFileNew);
      fs.unlinkSync(abcFile);
    } else {
      console.error(red, `ERROR ${abcFile} is lost`, reset);
      process.exit(FAIL);
    }
  }
}

function es2abcByWorkers(jsonInput, cmd) {
  const inputPaths = JSON.parse(jsonInput);
  for (let i = 0; i < inputPaths.length; ++i) {
    const input = inputPaths[i].path;
    const abcFile = input.replace(/_.js$/, '.abc');
    const singleCmd = `${cmd} "${input}" --output "${abcFile}"`;
    console.debug('gen abc cmd is: ', singleCmd, ' ,file size is:', inputPaths[i].size, ' byte');
    try {
      childProcess.execSync(singleCmd);
    } catch (e) {
      console.error(red, `ERROR Failed to convert file ${input} to abc `, reset);
      process.exit(FAIL);
    }
  }

  return;
}

if (cluster.isWorker && process.env["inputs"] !== undefined && process.env["cmd"] !== undefined) {
  if (process.env.panda === TS2ABC) {
    js2abcByWorkers(process.env['inputs'], process.env['cmd']);
  } else if (process.env.panda === ES2ABC  || process.env.panda === 'undefined' || process.env.panda === undefined) {
    es2abcByWorkers(process.env['inputs'], process.env['cmd']);
  } else {
    console.error(red, `ERROR please set panda module`, reset);
    process.exit(FAIL);
  }
  process.exit(SUCCESS);
}
