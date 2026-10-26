'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

class Sheet {
  constructor(columns) { this.rows = [Array(columns).fill('header')]; }
  getLastRow() { return this.rows.length; }
  getRange(row, column, count, width) {
    const sheet = this;
    return {
      setValues(values) { values.forEach((value, index) => { sheet.rows[row - 1 + index] = value; }); },
      getValues() { return sheet.rows.slice(row - 1, row - 1 + count).map(value => value.slice(column - 1, column - 1 + width)); },
      createTextFinder(text) {
        return {
          matchEntireCell() { return this; },
          findNext() {
            for (let index = row - 1; index < sheet.rows.length; index++) {
              if (String(sheet.rows[index][column - 1]) === text) return {getRow:() => index + 1};
            }
            return null;
          },
          findAll() {
            return sheet.rows.slice(row - 1).flatMap((value, index) =>
              String(value[column - 1]) === text ? [{getRow:() => row + index}] : []);
          }
        };
      }
    };
  }
  appendRow(value) { this.rows.push(value); }
}

const resultSheet = new Sheet(12);
const answerSheet = new Sheet(10);
const book = {getSheetByName:name => name === 'QUIZ_RESULTADOS' ? resultSheet : name === 'QUIZ_RESPUESTAS' ? answerSheet : null};
const sandbox = {
  LockService:{getScriptLock:() => ({waitLock(){}, releaseLock(){}})},
  SpreadsheetApp:{openById:() => book, flush(){}},
  ContentService:{MimeType:{JSON:'json'}, createTextOutput:text => ({setMimeType(){return {text};}})}
};
vm.runInNewContext(fs.readFileSync(`${__dirname}/Code.gs`, 'utf8') + '\nthis.submit = doPost;', sandbox);

const key = {RTO01Q01:'A',RTO01Q02:'D',RTO01Q03:'B',RTO01Q04:'B',RTO01Q05:'D',RTO01Q06:'A',RTO01Q07:'B',RTO01Q08:'D',RTO01Q09:'D',RTO01Q10:'C',RTO01Q11:'A',RTO01Q12:'D',RTO01Q13:'D',RTO01Q14:'D',RTO01Q15:'C'};
const responses = Object.entries(key).reverse().map(([preguntaId, respuesta]) => ({preguntaId, respuesta, segundos:30}));
const payload = {action:'quiz',quiz:'1SI-JAVA-REPASO-OFICIAL-01',attemptId:'12345678-1234-1234-1234-123456789abc',alumno:'prueba@svalero.com',email:'prueba@svalero.com',grupo:'1SI-JAVA',tiempoTotal:450,respuestas:responses};
const call = value => JSON.parse(sandbox.submit({postData:{contents:JSON.stringify(value)}}).text);

const first = call(payload);
assert.equal(first.ok, true);
assert.equal(first.resultado.aciertos, 15);
assert.equal(resultSheet.rows.length, 2);
assert.equal(answerSheet.rows.length, 16);
const retry = call(payload);
assert.equal(retry.duplicate, true);
assert.equal(resultSheet.rows.length, 2);
assert.equal(answerSheet.rows.length, 16);
assert.equal(call({...payload,respuestas:responses.slice(1)}).ok, false);
console.log('OK: answers in randomized order, server score, idempotent retry and invalid payload rejection.');
