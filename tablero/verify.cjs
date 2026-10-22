const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const context=vm.createContext({localStorage:{getItem:()=>null},console});
vm.runInContext(fs.readFileSync(__dirname+'/app.js','utf8').replace(/render\(\);\s*$/,''),context);
const result=vm.runInContext(`(() => {
 const fill=makeFrames(1),print=makeFrames(2),collision=makeFrames(4),move=makeFrames(5);
 return {
  fillStart:fill[0].b.flat().filter(x=>x==='*').length,
  fillEnd:fill.at(-1).b.flat().filter(x=>x==='*').length,
  fillChange:fill.slice(1).every((f,i)=>f.b.flat().filter(x=>x==='*').length===i+1),
  printed:print.at(-1).console,
  printUnchanged:print.every(f=>JSON.stringify(f.b)===JSON.stringify(print[0].b)),
  safeCollision:collision.slice(0,-1).every(f=>f.b[0][0]==='Y'&&f.b[9][9]==='F'&&f.b.flat().filter(x=>x==='P').length===0),
  obstacle:collision.at(-1).b[2][3],
  ys:move.at(-1).b.flat().filter(x=>x==='Y').length,
  origin:move.at(-1).b[0][0],destination:move.at(-1).b[0][1]
 };
})()`,context);
assert.equal(result.fillStart,0);assert.equal(result.fillEnd,100);assert.ok(result.fillChange);
assert.equal(result.printed,('* '.repeat(10)+'\n').repeat(10));assert.ok(result.printUnchanged);
assert.ok(result.safeCollision);assert.equal(result.obstacle,'P');
assert.equal(result.ys,1);assert.equal(result.origin,'*');assert.equal(result.destination,'Y');
const rubric=JSON.parse(fs.readFileSync(__dirname+'/rubrica.json','utf8'));
assert.equal(rubric.criteria.reduce((sum,c)=>sum+c.points,0),100);
assert.equal(new Set(rubric.criteria.map(c=>c.id)).size,rubric.criteria.length);
console.log('OK: 100 asignaciones, impresión sin mutación, colisiones, movimiento y rúbrica de 100 puntos.');
