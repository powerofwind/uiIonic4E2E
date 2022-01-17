@Chromium
Feature: pageAction
	มีการทำ Action บางอย่างในเพจทำให้ข้อมูลในหน้ามีการเปลี่ยนแปลง

Scenario: Search ของในหน้าเจอ
	Given เปิดหน้านี้นะ 'http://localhost:8100/user-list'
	And ใส่ keyword ที่ต้องการค้นหา 'aaa'
	When กดปุ่มค้นหา
	Then แสดงผลลัพธ์มีชื่อ 'aaa' 

Scenario: Search ของในหน้าไม่เจอ
	Given เปิดหน้านี้นะ 'http://localhost:8100/user-list'
	And ใส่ keyword ที่ต้องการค้นหา 'aaaz'
	When กดปุ่มค้นหา
	Then แสดง 'ไม่มีรายการ'

Scenario: Check text ในปุ่ม
	Given เปิดหน้านี้นะ 'http://localhost:8100/user-list/user-info'
	When ผู้ใช้กดปุ่มเปลี่ยนสถานะ
	And เลือกสถานะแก้สำเร็จ
	And กดปุ่ม ok
	Then แสดงสถานะ 'แก้สำเร็จแล้ว'
	
Scenario: ได้รับ signal R ทำให้ข้อมูลในหน้ามีการเปลี่ยนแปลง
	Given เปิดหน้านี้นะ 'http://localhost:8100/user-list'
	And ซักพักจะมีข้อความขึ้นมาโดยอัตโนมัติ

Scenario: Check progress bar
	Given เปิดหน้านี้นะ 'http://localhost:8100/user-list'
	Then แถบ progressbar ที่ทำเสร็จแล้วจะแสดงเวลา