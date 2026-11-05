import {test,expect} from '@playwright/test';
test('Typing stays local, same prompt can be submitted twice, and retry preserves history',async({page})=>{
 let requests=0;page.on('request',r=>{if(r.url().endsWith('/api/ai/summary'))requests++;});
 await page.goto('/');await page.getByLabel('Review prompt').fill('Review ticket 2');
 await page.waitForTimeout(350);expect(requests).toBe(0);
 await page.getByRole('button',{name:'Generate review',exact:true}).click();
 await expect(page.getByText('Mode simulated',{exact:true})).toBeVisible();expect(requests).toBe(1);
 await page.getByRole('button',{name:'Generate review',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Completed review history'}).locator('..').locator('ul').last().getByRole('listitem')).toHaveCount(2);
 await page.getByLabel('Review prompt').fill('[fail]');await page.getByRole('button',{name:'Generate review',exact:true}).click();
 await expect(page.getByRole('button',{name:'Retry review',exact:true})).toBeVisible();
});
test('Stream errors expose retry and cancellation hides old output',async({page})=>{
 await page.goto('/');await page.getByLabel('Review prompt').fill('[broken]');
 await page.getByRole('button',{name:'Stream review',exact:true}).click();
 await expect(page.getByRole('button',{name:'Retry stream',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Cancel requests',exact:true}).click();
 await expect(page.getByRole('button',{name:'Retry stream',exact:true})).toHaveCount(0);
});
