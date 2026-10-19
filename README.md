News Management System

ระบบจัดการข่าวสาร (News Management System) สำหรับเพิ่ม แสดงรายละเอียด แก้ไข ลบ ค้นหา และกรองข่าว โดยจัดเก็บข้อมูลใน PostgreSQL และพัฒนาด้วย React และ Node.js

1. ชุดโจทย์และข้อกำหนดของระบบ
1.1 การแสดงข้อมูลข่าว
แสดงข้อมูลข่าวจากฐานข้อมูลในรูปแบบตาราง
แสดงรหัสข่าว หัวข้อข่าว ผู้รับผิดชอบ/ผู้รายงาน หมวดหมู่ วันที่เผยแพร่ และสถานะ
สามารถเปิดดูรายละเอียดข่าวได้ครบทุกฟิลด์
แสดงสถานะกำลังโหลดเมื่อเรียกข้อมูล
แสดงข้อความเมื่อไม่มีข้อมูลหรือค้นหาไม่พบ
แสดงข้อความแจ้งข้อผิดพลาดเมื่อเรียก API ไม่สำเร็จ
1.2 การเพิ่มข่าว
เพิ่มข่าวผ่านแบบฟอร์ม
กรอกหัวข้อข่าว ผู้รับผิดชอบ หมวดหมู่ วันที่เผยแพร่ และสถานะ
รองรับรายละเอียดข่าวเพิ่มเติม
ตรวจสอบข้อมูลที่จำเป็นก่อนส่ง API
แสดงข้อความแจ้งผลเมื่อเพิ่มข่าวสำเร็จหรือไม่สำเร็จ
1.3 การแก้ไขข่าว
เลือกข่าวที่ต้องการแก้ไข
แสดงข้อมูลเดิมในแบบฟอร์ม
บันทึกการแก้ไขผ่าน API
สามารถยกเลิกการแก้ไขได้โดยไม่เปลี่ยนแปลงข้อมูลในฐานข้อมูล
1.4 การลบข่าว
แสดงข้อความยืนยันก่อนลบ โดยระบุหัวข้อข่าว
หากยกเลิก ต้องไม่มีการลบข้อมูล
หากยืนยัน ให้ลบข้อมูลผ่าน API และปรับปรุงรายการข่าว
1.5 การค้นหาและกรองข่าว
ค้นหาจากหัวข้อข่าวด้วยคำค้นบางส่วน
กรองตามหมวดหมู่
ใช้คำค้นและหมวดหมู่ร่วมกันผ่าน Query Parameters ที่ Backend
สามารถล้างเงื่อนไขเพื่อแสดงข่าวทั้งหมดได้
1.6 ข้อกำหนดด้านการพัฒนา
ใช้ React Hooks ในการจัดการสถานะ
แยก Frontend Components, Pages และ Services
แยก Backend Router, Controller และ Model
ใช้ PostgreSQL เป็นฐานข้อมูลจริง
ตั้งค่า CORS ให้ Frontend ติดต่อ Backend ได้
ใช้ Environment Variables สำหรับการตั้งค่าระบบ
ข้อมูลต้องยังคงอยู่หลังรีเฟรชหน้าเว็บหรือรีสตาร์ต Backend
เตรียมข้อมูลอย่างน้อย 10 รายการ ครบทั้ง 3 หมวดหมู่ และมีทั้งข่าวเผยแพร่แล้วกับฉบับร่าง
2. เครื่องมือและเทคโนโลยี
ส่วนงาน	เทคโนโลยี
Frontend	React, Vite
ภาษา Frontend	JavaScript, CSS
ไอคอน	lucide-react
แจ้งเตือน	SweetAlert2
Backend	Node.js, Express.js
ORM	Sequelize
Database	PostgreSQL
API Communication	Fetch API, REST API
Container	Docker, Docker Compose
Environment	dotenv, .env
3. โครงสร้างโปรเจกต์
Final-Test-Product/
├── docker-compose.yml
├── .env
├── README.md
│
├── backend/
│   ├── package.json
│   ├── index.js
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   └── newsModel.js
│   ├── controllers/
│   │   └── newsController.js
│   └── router/
│       └── newsRouter.js
│
└── frontend/
    ├── package.json
    ├── .env
    ├── index.html
    └── src/
        ├── components/
        ├── pages/
        ├── services/
        ├── App.jsx
        ├── main.jsx
        └── index.css


หมายเหตุ: ชื่อไฟล์และโฟลเดอร์ต้องตรงกับไฟล์จริงในโปรเจกต์ รวมถึงตัวพิมพ์เล็กและใหญ่ เช่น model กับ models

4. การออกแบบฐานข้อมูล

ใช้ PostgreSQL เป็นฐานข้อมูลสำหรับจัดเก็บข่าว โดยกำหนดฐานข้อมูลชื่อ product_db

4.1 ตารางข่าว

ตาราง News มีฟิลด์ดังนี้

ฟิลด์	ชนิดข้อมูล	รายละเอียด
id	INTEGER	รหัสข่าว Primary Key และ Auto Increment
title	VARCHAR(150)	หัวข้อข่าว จำเป็น
operations	VARCHAR(100)	ผู้รับผิดชอบ/ผู้รายงาน จำเป็น
category	VARCHAR(50)	หมวดหมู่ข่าว จำเป็น
date	DATE	วันที่เผยแพร่ จำเป็น
description	STRING/TEXT	รายละเอียดเพิ่มเติม ไม่บังคับ
status	BOOLEAN	สถานะข่าว จำเป็น

หมวดหมู่ข่าวที่รองรับ ได้แก่

การศึกษา
เทคโนโลยี
สังคม

ความหมายของสถานะ:

true = เผยแพร่แล้ว
false = ฉบับร่าง

ชื่อฟิลด์ใน Frontend และ Backend ต้องตรงกัน โดยใช้ operations และ date ตาม Model เดิม

5. การสร้างฐานข้อมูล
วิธีที่ 1: ใช้ Docker Compose (แนะนำ)

ติดตั้ง Docker Desktop ให้เรียบร้อย จากนั้นเปิด Terminal ที่โฟลเดอร์หลักของโปรเจกต์

docker compose up -d postgres-db


ตรวจสอบสถานะ Container:

docker compose ps


ตรวจสอบว่า PostgreSQL พร้อมรับการเชื่อมต่อ:

docker compose logs postgres-db


เมื่อ Container ทำงานสำเร็จ ฐานข้อมูล product_db จะถูกสร้างอัตโนมัติจาก Environment Variables หากเป็นการเริ่มต้นด้วย Volume ใหม่

ข้อมูลฐานข้อมูลถูกเก็บใน Docker Volume ชื่อ pgdata เพื่อคงข้อมูลระหว่างการรีสตาร์ต Container

วิธีที่ 2: สร้างฐานข้อมูลด้วย PostgreSQL โดยตรง

หากติดตั้ง PostgreSQL ในเครื่อง สามารถใช้คำสั่งต่อไปนี้ใน psql โดยเชื่อมต่อด้วยบัญชีที่มีสิทธิ์สร้างฐานข้อมูล

CREATE DATABASE product_db;


จากนั้นตั้งค่า DB_HOST, DB_PORT, DB_NAME, DB_USER และ DB_PASSWORD ให้ตรงกับ PostgreSQL ที่ติดตั้งไว้

หมายเหตุ: เมื่อใช้ Sequelize Model ต้องตรวจสอบการ Sync ตารางใน config/database.js ด้วย เพราะการสร้าง Database ไม่ได้หมายความว่าตารางข่าวจะถูกสร้างให้อัตโนมัติ เว้นแต่มีการตั้งค่า Sync หรือ Migration ไว้แล้ว
6. การตั้งค่า Environment Variables
6.1 ไฟล์ .env ที่โฟลเดอร์หลัก

สร้างไฟล์ .env ไว้ระดับเดียวกับ docker-compose.yml

# PostgreSQL
POSTGRES_USER=dev_user
POSTGRES_PASSWORD=dev_password
POSTGRES_DB=product_db
POSTGRES_PORT=5433

# Backend
NODE_ENV=development
BACKEND_PORT=5000

# Database connection for Docker backend
DB_HOST=postgres-db
DB_PORT=5432
DB_NAME=product_db
DB_USER=dev_user
DB_PASSWORD=dev_password

# Frontend
FRONTEND_PORT=5173
VITE_API_URL=http://localhost:5000


คำอธิบาย:

POSTGRES_PORT=5433 คือพอร์ต PostgreSQL ที่เปิดให้เข้าถึงจาก Host
DB_PORT=5432 คือพอร์ต PostgreSQL ภายใน Docker Network
DB_HOST=postgres-db ใช้เมื่อ Backend ทำงานใน Docker Compose
BACKEND_PORT=5000 คือพอร์ต Backend
FRONTEND_PORT=5173 คือพอร์ต Frontend
VITE_API_URL คือ URL ที่ Frontend ใช้เรียก API

ข้อควรระวัง: ค่า DB_HOST=postgres-db ใช้ได้ภายใน Docker Network เท่านั้น หากรัน Backend ด้วย npm run dev จาก Windows โดยตรง ให้เปลี่ยน DB_HOST เป็น localhost และใช้ DB_PORT=5433 เพื่อเชื่อมต่อ PostgreSQL ที่เปิดพอร์ตไว้บน Host

อย่าเผยแพร่รหัสผ่านฐานข้อมูลจริงใน Repository สาธารณะ

6.2 ไฟล์ frontend/.env
VITE_API_URL=http://localhost:5000


ตัวแปรที่ขึ้นต้นด้วย VITE_ จะถูกนำไปใช้ใน Frontend ได้ จึงไม่ควรเก็บรหัสผ่านหรือข้อมูลลับไว้ในตัวแปรเหล่านี้

7. การติดตั้ง Dependencies
7.1 ติดตั้ง Backend
cd backend
npm install


ตรวจสอบว่า backend/package.json มีคำสั่งเริ่มระบบ เช่น

{
  "scripts": {
    "dev": "nodemon index.js",
    "start": "node index.js"
  }
}


และมี Dependencies ที่จำเป็น เช่น Express, Sequelize, PostgreSQL Driver, dotenv และ cors

7.2 ติดตั้ง Frontend

เปิด Terminal อีกหน้าต่างหนึ่ง:

cd frontend
npm install


Frontend ใช้ React, Vite, Tailwind CSS ตามที่กำหนดไว้ในโปรเจกต์, lucide-react และ SweetAlert2

8. การตั้งค่า Backend
8.1 เชื่อมต่อฐานข้อมูล

ไฟล์ backend/config/database.js ต้องตั้งค่า Sequelize ให้ใช้ PostgreSQL และอ่านค่าจาก Environment Variables

ตัวอย่างแนวทาง:

import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "postgres",
    logging: false,
  }
);

export async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");

    // ใช้เมื่อโปรเจกต์ยังไม่มีระบบ Migration
    await sequelize.sync();
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
}


หากโปรเจกต์มี Migration อยู่แล้ว ควรใช้ Migration เพื่อจัดการโครงสร้างตารางแทนการ Sync โดยตรงใน Production

8.2 ตั้งค่า Router

Backend ควรมี API สำหรับจัดการข่าว ได้แก่

Method	Endpoint	การทำงาน
GET	/api/news	แสดงข่าวทั้งหมดและค้นหา/กรอง
GET	/api/news/:id	ดูรายละเอียดข่าว
POST	/api/news	เพิ่มข่าว
PUT	/api/news/:id	แก้ไขข่าว
DELETE	/api/news/:id	ลบข่าว

ชื่อ Endpoint ต้องตรงกับที่กำหนดไว้ในไฟล์ backend/router/newsRouter.js และ Frontend Services

8.3 เริ่ม Backend

รันจากโฟลเดอร์ backend

npm run dev


หากเชื่อมต่อฐานข้อมูลสำเร็จ ควรเห็นข้อความยืนยันการเชื่อมต่อ และเซิร์ฟเวอร์ทำงานที่พอร์ต 5000

9. การเริ่มระบบด้วย Docker Compose

เมื่อกำหนดไฟล์ .env และ docker-compose.yml เรียบร้อยแล้ว ให้กลับไปยังโฟลเดอร์หลัก

เริ่มทุกบริการ
docker compose up -d --build


ตรวจสอบสถานะบริการ:

docker compose ps


ดู Log ของ Backend:

docker compose logs -f backend


ดู Log ของ Frontend:

docker compose logs -f frontend


ดู Log ของ PostgreSQL:

docker compose logs -f postgres-db


เข้าถึงระบบผ่าน Browser:

Frontend: http://localhost:5173
Backend: http://localhost:5000
PostgreSQL จาก Host: localhost:5433

หากต้องการหยุดระบบ:

docker compose down


คำสั่งนี้จะหยุดและลบ Container แต่เก็บข้อมูลใน Named Volumes ไว้

หากต้องการลบฐานข้อมูลที่เก็บใน Volume ด้วย ให้ใช้คำสั่งต่อไปนี้ด้วยความระมัดระวัง:

docker compose down -v


คำเตือน: คำสั่งนี้ลบ Volume ที่ Compose ใช้งาน รวมถึงข้อมูล PostgreSQL ที่บันทึกอยู่ใน Volume ดังกล่าว

10. คำสั่งเริ่มระบบแบบไม่ใช้ Docker

หากต้องการรัน PostgreSQL ด้วย Docker แต่รัน Backend และ Frontend จากเครื่องโดยตรง ให้เริ่ม PostgreSQL ก่อน

docker compose up -d postgres-db


จากนั้นตั้งค่า .env สำหรับ Backend ให้ใช้ Host ดังนี้

DB_HOST=localhost
DB_PORT=5433


เปิด Terminal สำหรับ Backend:

cd backend
npm install
npm run dev


เปิด Terminal อีกหน้าต่างสำหรับ Frontend:

cd frontend
npm install
npm run dev


เข้าใช้งานผ่าน http://localhost:5173

11. ข้อมูลทดสอบ

ระบบควรมีข้อมูลข่าวอย่างน้อย 10 รายการ ครบ 3 หมวดหมู่ และมีทั้งข่าวเผยแพร่แล้วกับฉบับร่าง

ตัวอย่างข้อมูลสำหรับเพิ่มผ่าน API:

{
  "title": "เปิดภาคเรียนใหม่",
  "operations": "สมชาย ใจดี",
  "category": "การศึกษา",
  "date": "2026-10-19",
  "status": true,
  "description": "ข่าวประชาสัมพันธ์การเปิดภาคเรียนใหม่"
}


สามารถเพิ่มข้อมูลผ่านหน้าเว็บหรือสร้าง Seed Script สำหรับใส่ข้อมูลทดสอบลง PostgreSQL ได้ โดยต้องไม่สร้างข้อมูลซ้ำทุกครั้งที่เริ่มระบบ

12. การตรวจสอบการทำงาน

ตรวจสอบตามรายการต่อไปนี้:

PostgreSQL ทำงานและเชื่อมต่อได้
ตารางข่าวถูกสร้างในฐานข้อมูล
Backend เริ่มทำงานได้โดยไม่มี Error
Frontend เปิดหน้าเว็บได้
แสดงรายการข่าวจากฐานข้อมูลจริง
เพิ่มข่าวได้
เปิดดูรายละเอียดข่าวได้
แก้ไขข่าวได้
ลบข่าวโดยมีการยืนยันได้
ค้นหาหัวข้อข่าวได้
กรองหมวดหมู่ได้
ค้นหาและกรองพร้อมกันได้
แสดง Loading, Empty State และ Error Message ได้
ข้อมูลยังอยู่หลังรีเฟรชหน้าเว็บ
ข้อมูลยังอยู่หลังรีสตาร์ต Backend
หน้าจอรองรับ Desktop, Tablet และ Mobile
13. ปัญหาที่พบบ่อย
SequelizeHostNotFoundError: getaddrinfo ENOTFOUND postgres-db

สาเหตุ: Backend ทำงานบน Windows โดยตรง แต่กำหนด DB_HOST=postgres-db ซึ่งเป็นชื่อบริการที่ใช้ได้เฉพาะใน Docker Network

วิธีแก้: หากรัน Backend บน Windows โดยตรง ให้ใช้ DB_HOST=localhost และ DB_PORT=5433 แต่ถ้ารัน Backend ใน Docker ให้ใช้ DB_HOST=postgres-db และ DB_PORT=5432

ERR_MODULE_NOT_FOUND

สาเหตุ: Import Path ไม่ตรงกับชื่อไฟล์จริง

วิธีแก้: ตรวจสอบชื่อไฟล์และ Path ของ Controller, Model และ Router รวมถึงนามสกุล .js ให้ตรงกัน

Frontend เรียก API ไม่สำเร็จ

ตรวจสอบ:

Backend เริ่มทำงานอยู่หรือไม่
ค่า VITE_API_URL ถูกต้องหรือไม่
CORS เปิดให้ Frontend ติดต่อ Backend ได้หรือไม่
Endpoint ใน Services ตรงกับ Router หรือไม่
เพิ่มข่าวไม่ได้

ตรวจสอบว่า Frontend ส่งฟิลด์ title, operations, category, date, status และ description ตรงกับ Backend และกำหนด status เป็น Boolean

14. สรุป

News Management System เป็นระบบจัดการข่าวที่พัฒนาด้วย React และ Node.js โดยใช้ Express สำหรับสร้าง REST API, Sequelize สำหรับเชื่อมต่อฐานข้อมูล PostgreSQL และ Docker Compose สำหรับจัดการบริการของระบบ

ระบบรองรับการเพิ่ม แสดง แก้ไข ลบ ค้นหา และกรองข่าว พร้อมการตรวจสอบข้อมูลและการแจ้งสถานะ เพื่อให้สามารถจัดการข่าวจากฐานข้อมูลจริงได้อย่างเป็นระบบ