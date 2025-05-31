# Uniskills Platform

A platform connecting students/graduates with employers, staff, and mentors.

## Features

- User Management (Students, Employers, Staff, Mentors)
- Profile Management
- Job Posting and Applications
- Forums and Discussions
- Payment Processing
- Matchmaking System

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/uniskills.git
cd uniskills
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following content:
```
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=uniskills
DB_USER=postgres
DB_PASSWORD=postgres

# JWT Configuration
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=24h

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password

# Payment Configuration (Stripe)
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# File Upload (AWS S3)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=your-aws-region
AWS_BUCKET_NAME=your-bucket-name
```

4. Create the database:
```bash
createdb uniskills
```

5. Run database migrations:
```bash
npm run migrate
```

6. (Optional) Seed the database with demo data:
```bash
npm run seed
```

7. Start the development server:
```bash
npm run dev
```

The server will be running at http://localhost:3000

## API Documentation

### Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer your-token-here
```

### Available Routes

#### Users
- POST /api/users/register - Register a new user
- POST /api/users/login - Login user
- GET /api/users/me - Get current user
- PUT /api/users/me - Update current user

#### Profiles
- GET /api/profiles/me - Get current user's profile
- PUT /api/profiles/me - Update current user's profile
- POST /api/profiles/me/education - Add education
- POST /api/profiles/me/experience - Add experience
- POST /api/profiles/me/skills - Add skills

#### Jobs
- GET /api/jobs - Get all jobs
- POST /api/jobs - Create job (employer only)
- GET /api/jobs/:id - Get job details
- PUT /api/jobs/:id - Update job (employer only)
- DELETE /api/jobs/:id - Delete job (employer only)

#### Forums
- GET /api/forums/posts - Get all posts
- POST /api/forums/posts - Create post
- GET /api/forums/posts/:id - Get post details
- POST /api/forums/posts/:id/comments - Add comment

#### Payments
- GET /api/payments/methods - Get payment methods
- POST /api/payments/methods - Add payment method
- GET /api/payments/withdrawals - Get withdrawals
- POST /api/payments/withdrawals - Request withdrawal

#### Matchmaking
- GET /api/matchmaking/matches - Get matches
- POST /api/matchmaking/matches/:id/respond - Respond to match

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 