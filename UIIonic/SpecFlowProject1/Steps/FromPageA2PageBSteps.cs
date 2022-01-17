using FluentAssertions;
using Microsoft.Playwright;
using System;
using System.Threading.Tasks;
using TechTalk.SpecFlow;

namespace SpecFlowProject1.Steps
{
    [Binding]
    public sealed class FromPageA2PageBSteps
    {
        private readonly IBrowser browser;
        private IPage page;

        public FromPageA2PageBSteps(ScenarioContext scenarioContext)
        {
            browser = scenarioContext.Get<IBrowser>();
        }

        [Given(@"จากหน้า '(.*)'")]
        public async Task Givenจากหนา(string url)
        {
            page ??= await browser.NewPageAsync();
            await page.GotoAsync(url);
        }

        [Given(@"กด user '(.*)'")]
        public async Task GivenกดUser(string name)
        {
            await page.ClickAsync("ion-col:has-text(\"aaa\")");
        }

        [When(@"เปิดหน้า '(.*)'")]
        public async Task Whenเปดหนา(string url)
        {
            await page.GotoAsync(url);
        }

        [Then(@"ตรวจสอบข้อมูล emailต้องมีค่าเป็น\t'(.*)'")]
        public async Task ThenตรวจสอบขอมลEmailตองมคาเปน(string expected)
        {
            var actual = await page.InnerTextAsync("text=อีเมล : xxx@gmail.com");
            actual.Should().BeEquivalentTo(expected);
        }

        [Then(@"ตรวจสอบข้อมูล emailต้องไม่เป็นค่าว่าง")]
        public async Task ThenตรวจสอบขอมลEmailตองไมเปนคาวาง()
        {
            var actual = await page.InnerTextAsync("text=อีเมล : xxx@gmail.com");
            actual.Should().NotBeNull();

        }

    }
}
