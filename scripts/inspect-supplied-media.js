import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
const b=await chromium.launch({channel:'chrome'}); const p=await b.newPage();
for(const id of ['01','02']) {
 const base64=(await fs.readFile(`public/demo/supplied-${id}.mp4`)).toString('base64');
 const result=await p.evaluate(async base64=>{const v=document.createElement('video');v.muted=true;v.src='data:video/mp4;base64,'+base64;await new Promise((r,j)=>{v.onloadedmetadata=r;v.onerror=()=>j(new Error('Decode failed'));});const meta={duration:v.duration,width:v.videoWidth,height:v.videoHeight};v.currentTime=Math.min(2,v.duration/3);await new Promise(r=>v.onseeked=r);const c=document.createElement('canvas');c.width=720;c.height=Math.round(720*v.videoHeight/v.videoWidth);c.getContext('2d').drawImage(v,0,0,c.width,c.height);return {meta,poster:c.toDataURL('image/webp',.85).split(',')[1]};},base64);
 await fs.writeFile(`public/demo/supplied-${id}.webp`,Buffer.from(result.poster,'base64'));console.log(id,JSON.stringify(result.meta));
}
await b.close();
