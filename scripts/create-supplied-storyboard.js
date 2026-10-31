// Extract matched storyboard frames and four silent, four-second excerpts.
// Source video audio is deliberately excluded from these shot studies.
import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
const b=await chromium.launch({channel:'chrome'}), p=await b.newPage();
const shots=[['reveal','01',1],['texture','01',5],['ritual','01',8],['signature','01',11]];
for (const [name,source,start] of shots) {
 const encoded=(await fs.readFile(`public/demo/supplied-${source}.mp4`)).toString('base64');
 const result=await p.evaluate(async ({encoded,start})=>{
  const v=document.createElement('video');v.muted=true;v.playsInline=true;v.src='data:video/mp4;base64,'+encoded;
  await new Promise((r,j)=>{v.onloadedmetadata=r;v.onerror=()=>j(Error('Source decode failed'));});
  v.currentTime=start;await new Promise(r=>v.onseeked=r);
  const c=document.createElement('canvas');c.width=432;c.height=768;const ctx=c.getContext('2d');
  ctx.drawImage(v,0,0,432,768);const poster=c.toDataURL('image/webp',.88).split(',')[1];
  const stream=c.captureStream(24),chunks=[],rec=new MediaRecorder(stream,{mimeType:'video/webm;codecs=vp9',videoBitsPerSecond:1000000});
  const done=new Promise(r=>rec.onstop=async()=>r(Array.from(new Uint8Array(await new Blob(chunks).arrayBuffer()))));
  rec.ondataavailable=e=>chunks.push(e.data);rec.start();await v.play();
  await new Promise(r=>{const begin=performance.now();function tick(now){ctx.drawImage(v,0,0,432,768);if(now-begin<4000)requestAnimationFrame(tick);else r();}requestAnimationFrame(tick);});
  v.pause();rec.stop();stream.getTracks().forEach(t=>t.stop());return {poster,bytes:await done};
 },{encoded,start});
 await fs.writeFile(`public/demo/study-${name}.webp`,Buffer.from(result.poster,'base64'));
 await fs.writeFile(`public/demo/study-${name}.webm`,Buffer.from(result.bytes));console.log(name,'saved');
}
await b.close();
