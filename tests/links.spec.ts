import { test, expect } from '@playwright/test';

test('Check Number of Links in Landing Page', async ({ page }) => {
  test.setTimeout(120000)
  const response = await page.goto('https://novabank.ng/', { timeout: 60000 });
  expect(response?.status()).toBe(200);

const linkElements = await page.$$('a');
const numberOfLink = linkElements.length

// Extract the href attributes and text content from each link element
const links = await Promise.all(linkElements.map(async (linkElement) => {
  const href = await linkElement.getAttribute('href');
  const text = await linkElement.innerText();
  return { href, text };
}));

    console.log('Number of Links:', numberOfLink);
    console.log('Links:', links.slice(0,5)); //Logs the first 5 links for brevity
   
    let workingLinksCount = 0;
    let brokenLinksCount = 0;
    let noResponseLinksCount = 0;
    let failToOpenLinksCount = 0;
    let nullLinksCount = 0;


    for (const link of links) {
      if (!link.href) {
        console.log(`Skipping link with null href: ${link.text}`);
        nullLinksCount++
        continue;
      }
      try {
        console.log(`Checking link: ${link.text} (${link.href})`);
        const response = await page.goto(link.href);
        // Ensure the response is not null
        if (response) {
          const status = response.status();
          if (status >= 200 && status < 300) {
            console.log(`Link is working: ${link.href} (Status: ${status})`); 
            workingLinksCount++
          } else {
            console.log(`Link might be broken: ${link.href} (Status: ${status})`);
            brokenLinksCount ++
          }
        } else {
          console.log(`No response received for link: ${link.href}`);
          noResponseLinksCount++
        }
      } catch (error) {
        console.log(`Failed to open link: ${link.href} (Error: ${error.message})`);
        failToOpenLinksCount++
      }
    }
    console.log('Number of working links:', workingLinksCount);
    console.log('Number of broken links:', brokenLinksCount);
    console.log('Number of no response links:', noResponseLinksCount);
    console.log('Number of fail to open links:', failToOpenLinksCount);
    console.log('Number of null links:', nullLinksCount);
    console.log('Total link count: ',workingLinksCount+brokenLinksCount+noResponseLinksCount+failToOpenLinksCount+nullLinksCount)
});

