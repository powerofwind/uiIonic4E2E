@Chromium
Feature: fromPageA2PageB
	จากหน้า a เปิดไปหน้า b สามารถตรวจสอบข้อมูลในหน้านั้นได้

Scenario: Check text
	Given  จากหน้า 'http://localhost:8100/user-list'
	And กด user 'aaa'
	When เปิดหน้า 'http://localhost:8100/user-list/user-info'
	Then ตรวจสอบข้อมูล emailต้องมีค่าเป็น	'อีเมล : xxx@gmail.com'
	Then ตรวจสอบข้อมูล emailต้องไม่เป็นค่าว่าง