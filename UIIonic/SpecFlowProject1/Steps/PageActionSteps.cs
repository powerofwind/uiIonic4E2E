using FluentAssertions;
using Microsoft.Playwright;
using System;
using System.Threading.Tasks;
using TechTalk.SpecFlow;

namespace SpecFlowProject1.Steps
{
    [Binding]
    public sealed class PageActionSteps
    {
        private readonly IBrowser browser;
        private IPage page;

        public PageActionSteps(ScenarioContext scenarioContext)
        {
            browser = scenarioContext.Get<IBrowser>();
        }

        [Given(@"เปิดหน้านี้นะ '(.*)'")]
        public async Task Givenเปดหนานนะ(string url)
        {
            page ??= await browser.NewPageAsync();
            await page.GotoAsync(url);
        }
        
        [Given(@"ใส่ keyword ที่ต้องการค้นหา '(.*)'")]
        public async Task GivenใสKeywordทตองการคนหา(string name)
        {
            await page.FillAsync("[placeholder=\"Search\"]", name);
        }
        
        [When(@"กดปุ่มค้นหา")]
        public async Task Whenกดปมคนหา()
        {
            await page.ClickAsync("text=ค้นหา >> button");
        }
        
        [When(@"ผู้ใช้กดปุ่มเปลี่ยนสถานะ")]
        public async Task Whenผใชกดปมเปลยนสถานะ()
        {
            await page.ClickAsync("label:has-text(\"ยังไม่ถูกแก้\")");
        }

        [When(@"เลือกสถานะแก้สำเร็จ")]
        public async Task Whenเลอกสถานะแกสำเรจ()
        {
            await page.ClickAsync("button[role=\"radio\"]:has-text(\"แก้สำเร็จแล้ว\")");
        }

        [When(@"กดปุ่ม ok")]
        public async Task WhenกดปมOk()
        {
            await page.ClickAsync("button:has-text(\"OK\")");
        }

        //TODO
        [Then(@"แสดงผลลัพธ์มีชื่อ '(.*)'")]
        public async Task Thenแสดงผลลพธมชอ(string expected)
        {
            //var actual = await page.InnerTextAsync("p:has-text(\"aaa\")");
            //var actual = await page.InnerTextAsync("text=aaa เปิดรับงาน >> button");
            //var actual = await page.searc
            //actual.Should().Contain("xxx");
        }

        [Then(@"แสดง '(.*)'")]
        public async Task Thenแสดง(string expected)
        {
            var actual = await page.InnerTextAsync("text=ไม่มีรายการ");
            actual.Should().BeEquivalentTo(expected);
        }

        [Then(@"แสดงสถานะ '(.*)'")]
        public async Task Thenแสดงสถานะ(string expected)
        {
            var actual = await page.InnerTextAsync("label:has-text(\"แก้สำเร็จแล้ว\")");
            actual.Should().BeEquivalentTo(expected);
        }

        //TODO
        [Given(@"ซักพักจะมีข้อความขึ้นมาโดยอัตโนมัติ")]
        public async Task Givenซกพกจะมขอความขนมาโดยอตโนมต()
        {
            var b = page.WaitForResponseAsync("text=Hello signal R มาแล้วจ้าาาาา");
            var a = page.WaitForSelectorAsync("text=Hello signal R มาแล้วจ้าาาาา");
            await page.WaitForSelectorAsync("text=โอนให้ ธ.กสิกร 5 >> div");
        }

        //TODO
        [Then(@"แถบ progressbar ที่ทำเสร็จแล้วจะแสดงเวลา")]
        public async Task ThenแถบProgressbarททำเสรจแลวจะแสดงเวลา()
        {
            var result = await page.TextContentAsync("li:has-text(\"ค้นหาไรเดอร์ ( 11:00 น.)\")");
            //var result = await page.TextContentAsync("text=ค้นหาไรเดอร์ ( 11:00 น.)");
            //var result = await page.InnerTextAsync("#receive");
            result.Should().Be("ค้นหาไรเดอร์ *");
            //await page.ClickAsync("li:has-text(\"กำลังจัดส่ง\")");
            //await page.IsVisibleAsync("li:has-text(\"ร้านรับออเดอร์ ( 11:05 น.)\")");
        }


    }
}
