import { test,expect } from '@playwright/test';
test('User can load tickets and advance a NEW ticket',async({page})=>{
 await page.goto('/');await expect(page.getByRole('heading',{name:'Work queue'})).toBeVisible();
 await expect(page.getByRole('heading',{name:'Refactor validation'})).toBeVisible();
 await page.getByRole('button',{name:'Advance 1'}).click();
 await expect(page.getByText('IN_PROGRESS · v2',{exact:true})).toBeVisible();
});
