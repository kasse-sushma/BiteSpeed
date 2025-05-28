# 🧠 Bitespeed Identity Reconciliation API

This project solves the Bitespeed backend engineering task — building a system that identifies and reconciles user identities based on overlapping contact information (email/phone).

---

## 🚀 Live API
- API          - [https://bitespeed-identity-4f1w.onrender.com](https://bitespeed-identity-4f1w.onrender.com/)
- API endpoint - [https://bitespeed-identity-4f1w.onrender.com/identify](https://bitespeed-identity-4f1w.onrender.com/identify)

---

## 🛠 Tech Stack

- **Node.js**
- **Express**
- **PostgreSQL**
- **Prisma ORM**

---

## 📦 API Endpoint

### `POST /identify`

Reconciles a user based on their `email` and/or `phoneNumber`.

#### ✅ Request Body
```json
{
  "email": "doc@flux.com",
  "phoneNumber": "123456"
}
````

#### ✅ Successful Response

```json
{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["doc@flux.com"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": []
  }
}
```

#### ❌ Error Response (invalid input)

```json
{
  "error": "At least one of email or phoneNumber must be provided."
}
```

---

## 🧪 Sample Test Cases

| Scenario                   | Result                      |
| -------------------------- | --------------------------- |
| New email + phone          | New primary contact         |
| New email + existing phone | Secondary linked to primary |
| Existing email/phone       | Returns same identity group |
| Empty body                 | 400 error                   |

---

## 🛠️ Local Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/Ganji-Sandeep-10/bitespeed-identity.git
cd bitespeed-identity
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up PostgreSQL and .env**

```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/bitespeed?schema=public"
```

4. **Run database migration**

```bash
npx prisma migrate dev --name init
```

5. **Start the server**

```bash
node src/server.js
```

6. **Open Prisma Studio (optional)**

```bash
npx prisma studio
```

---
## 🙌 Author

Ganji Sandeep
[GitHub](https://github.com/Ganji-Sandeep-10)

---
