import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
const b=await chromium.launch({channel:'chrome'});
for(const [id,url] of [['mockup','https://fomia-mockup.vercel.app/'],['war','https://fomi-part-b-war.vercel.app/']]){
 const ctx=await b.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'}),p=await ctx.newPage(),errors=[];
 p.on('pageerror',e=>errors.push(e.message));
 const r=await p.goto(url);await p.waitForTimeout(1800);await p.screenshot({path:`docs/screenshots/review-${id}-desktop.png`,fullPage:true});
 console.log(id,'STATUS',r.status(),'TITLE',await p.title(),'TEXT',await p.locator('body').innerText());
 console.log(id,'BUTTONS',await p.getByRole('button').allTextContents());
 await p.setViewportSize({width:390,height:844});await p.waitForTimeout(300);await p.screenshot({path:`docs/screenshots/review-${id}-mobile.png`,fullPage:true});
 console.log(id,'MOBILE_OVERFLOW',await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),'ERRORS',errors);
 await fs.writeFile(`tmp/review-${id}.json`,JSON.stringify({url,title:await p.title(),body:await p.locator('body').innerText(),errors},null,2));
 await ctx.close();
}
await b.close();
