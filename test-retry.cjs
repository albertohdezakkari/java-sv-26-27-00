const assert=require('node:assert/strict'),logic=require('./test/logic.js');
(async()=>{
 let calls=0;const waits=[],payload={attemptId:'same-attempt'};
 const receipt=await logic.submitWithRetry(async()=>{assert.equal(payload.attemptId,'same-attempt');if(++calls<3)throw new Error('transport');return {saved:true};},{pause:async(ms)=>waits.push(ms)});
 assert.equal(receipt.saved,true);assert.equal(calls,3);assert.equal(waits.length,2);
 calls=0;await assert.rejects(logic.submitWithRetry(async()=>{calls++;throw new Error('offline');},{pause:async()=>{}}));assert.equal(calls,3);
 calls=0;await assert.rejects(logic.submitWithRetry(async()=>{calls++;throw Object.assign(new Error('bad request'),{permanent:true});},{pause:async()=>{}}));assert.equal(calls,1);
 console.log('PASS bounded retries: transport recovery, unchanged attempt, stops after 3 failures, no retry on permanent validation error.');
})();
