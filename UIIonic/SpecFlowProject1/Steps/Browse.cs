using FluentAssertions;
using Microsoft.Playwright;
using System;
using System.Threading.Tasks;
using TechTalk.SpecFlow;

namespace SpecFlowProject1.Steps
{
    [Binding]
    public sealed class Browse
    {
        private readonly IBrowser browser;
        private IPage page;

        public Browse(ScenarioContext scenarioContext)
        {
            browser = scenarioContext.Get<IBrowser>();
        }

        [Given(@"เปิดหน้าเว็บ '(.*)'")]
        public async Task Givenเปดหนาเวบ(string url)
        {
            page ??= await browser.NewPageAsync();
            await page.GotoAsync(url);
        }
        
        [Given(@"กดปุ่มเลือกรูปภาพ")]
        public async Task Givenกดปมเลอกรปภาพ()
        {
            await page.ClickAsync("input[name=\"file\"]");
        }
        
        [When(@"browse รูปจากโฟลเดอร์ '(.*)'")]
        public async Task WhenBrowseรปจากโฟลเดอร(string path)
        {
            await page.SetInputFilesAsync("input[name=\"file\"]", new[] { path });
        }

        [When(@"กดปุ่ม upload")]
        public async Task WhenกดปมUpload()
        {
            await page.ClickAsync("input:has-text(\"Upload\")");
        }

        [Then(@"แสดงรูปภาพที่อัพโหลดบนเว็บ")]
        public async Task Thenแสดงรปภาพทอพโหลดบนเวบ()
        {
            var result = await page.InnerTextAsync("text=A.jpg");
            result.Should().Be("A.jpg");
        }
    }
}
