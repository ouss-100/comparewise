![Logo](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/th5xamgrr6se0x5ro4g6.png)

# CompareWise

**CompareWise** is a centralized, AI-powered platform that aggregates products from multiple Tunisian e-commerce marketplaces and intelligently compares them based on **price, quality, and features**.  
The goal is to help users make faster, smarter, and more informed purchasing decisions.

---

## 🌟 Key Features

- 🔍 Automated product scraping from multiple Tunisian e-commerce websites
- 🧹 Data cleaning and normalization for consistent product records
- 🤖 AI-powered comparison engine (price, quality, and features)
- 🗄️ Centralized MongoDB product database
- 📊 Advanced filtering by price, category, and brand
- 💻 Modern, responsive web interface

---

## 🛒 Product Scraper

The scraper continuously collects and updates product data from supported platforms using **Scrapy**.

### Supported Websites

| Name                | Website                         |
| ------------------- | ------------------------------- |
| Mytek               | https://www.mytek.tn            |
| SBS Informatique    | https://www.sbsinformatique.com |
| Scoop               | https://www.scoop.com.tn        |
| Skymil Informatique | https://skymil-informatique.com |
| Tunisianet          | https://www.tunisianet.com.tn   |
| Wiki                | https://wiki.tn                 |
| Zoom                | https://zoom.com.tn             |

---

## 🌐 Platform

The CompareWise platform provides a clean and intuitive interface that allows users to:

- Browse products from multiple sources in one place
- Compare prices across different websites
- View detailed product information (description, features, images)
- Identify the best value using AI-assisted insights

---

## 🧰 Tech Stack

### Backend & Scraping

- **Scrapy**
- **Python**
- **Playwright**

### Frontend

- **Next.js**
- **Tailwind CSS**

### Database

- **MongoDB**

---

## ⚙️ Installation & Setup

### 1️⃣ Scraper Setup

#### Create a virtual environment (recommended)

```bash
python -m venv venv
```

#### Activate the virtual environment

**Windows**

```bash
venv\Scripts\activate
```

**macOS / Linux**

```bash
source venv/bin/activate
```

#### Install dependencies

```bash
pip install -r requirements.txt
playwright install
```

---

### 2️⃣ Platform Setup

```bash
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file and add the following variables:

```env
MONGO_URI=your_mongodb_connection_string
MONGO_DATABASE=your_database_name
```

---

## 🗂️ Project Structure

```text
.
└── COMPAREWISE/
    ├── platform/
    └── scraper/
        ├── myenv/
        └── product_scraper/
            ├── product_scraper/
            ├── .env
            ├── scrapy.cfg
            └── requirements.txt
```

---

## 🎥 Demo

Coming soon...

---

## 🔗 Links

[![Portfolio](https://img.shields.io/badge/Portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://portfolio-alpha-one-2gmpksu9it.vercel.app)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/moussaoussama)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ouss-100)

---

© 2026 CompareWise — Built with ❤️ in Tunisia 🇹🇳
