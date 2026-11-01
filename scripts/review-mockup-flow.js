import {chromium} from '@playwright/test';
const b=await chromium.launch({channel:'chrome'}),p=await b.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
await p.goto('https://fomia-mockup.vercel.app/');await p.waitForTimeout(1200);
await p.getByRole('button',{name:'Video',exact:true}).first().click();await p.waitForTimeout(900);
console.log('VIDEO URL',p.url(),'TEXT',await p.locator('body').innerText());await p.screenshot({path:'docs/screenshots/review-mockup-video.png',fullPage:true});
const fields=await p.locator('textarea,input').evaluateAll(es=>es.map(e=>({tag:e.tagName,placeholder:e.placeholder,label:e.getAttribute('aria-label')})));console.log('FIELDS',fields);
await p.getByRole('button',{name:'Projects',exact:true}).first().click();await p.waitForTimeout(500);console.log('PROJECTS',await p.locator('body').innerText());await p.screenshot({path:'docs/screenshots/review-mockup-projects.png',fullPage:true});
await b.close();
