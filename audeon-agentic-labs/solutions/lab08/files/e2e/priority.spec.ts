import {test,expect} from '@playwright/test';
test('Priority selector filters the live memory API',async({page})=>{
 await page.goto('/');await expect(page.getByRole('heading',{name:'Priority review'})).toBeVisible();await page.getByLabel('Priority',{exact:true}).selectOption('HIGH');
 await expect(page.getByRole('heading',{name:'Priority review'})).toBeVisible();
 await expect(page.getByRole('heading',{name:'Refactor validation'})).toHaveCount(0);
});
