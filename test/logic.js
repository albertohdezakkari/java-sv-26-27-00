'use strict';
const TestLogic={
 remaining(deadline,now){return Math.max(0,Math.ceil((deadline-now)/1000));},
 resolve(choice,deadline,now){return now>=deadline?null:choice;},
 async submitWithRetry(send,{attempts=3,pause=ms=>new Promise(resolve=>setTimeout(resolve,ms)),onRetry=()=>{}}={}){
  for(let attempt=1;attempt<=attempts;attempt++){
   try{return await send();}catch(error){
    if(error.permanent||attempt===attempts)throw error;
    onRetry(attempt);await pause(1500*attempt+Math.floor(Math.random()*1200));
   }
  }
 },
 score(questions,answers){
  const correct=answers.filter((a,i)=>a===questions[i].a).length;
  const blank=answers.filter(a=>a===null).length;
  return {correct,blank,wrong:answers.length-correct-blank,grade:correct/questions.length*10};
 }
};
if(typeof module!=='undefined')module.exports=TestLogic;
