# Airbnb Clone

A full-stack clone of Airbnb featuring property listings, user authentication, booking system, and search functionality.

## Features

- User authentication (Sign up, Login, Logout)
- Browse property listings
- Advanced search and filter options
- Property details page with image gallery
- Booking system with date selection
- User dashboard
- Host property listings
- Reviews and ratings
- Responsive design
- Interactive maps integration
- Payment integration

## Technologies Used

### Frontend
- React.js / Next.js
- Tailwind CSS
- React Router
- React Date Picker
- Google Maps API / Mapbox

### Backend
- Node.js
- Express.js
- MongoDB / PostgreSQL
- JWT Authentication
- Cloudinary (image uploads)

## Installation

### Prerequisites
- Node.js (v14+)
- MongoDB or PostgreSQL
- npm or yarn

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/bellaleprasann20/airbnb-clone.git
cd airbnb-clone
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Create `.env` file:
```
PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. Start backend server:
```bash
npm start
```

### Frontend Setup

1. Navigate to frontend:
```bash
cd ../frontend
npm install
```

2. Create `.env.local`:
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_GOOGLE_MAPS_API_KEY=your_maps_api_key
```

3. Start frontend:
```bash
npm start
```

## Usage

1. Register as a new user or login
2. Browse available properties
3. Use filters to search by location, dates, price, etc.
4. View property details and reviews
5. Book a property
6. List your own property as a host

## Project Structure

```
airbnb-clone/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── App.js
│   └── public/
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`

### Properties
- `GET /api/properties`
- `GET /api/properties/:id`
- `POST /api/properties`
- `PUT /api/properties/:id`
- `DELETE /api/properties/:id`

### Bookings
- `POST /api/bookings`
- `GET /api/bookings/user/:userId`

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

MIT License

## Disclaimer

This is a clone project for educational purposes only.

---

**Commit Message:** `docs: add complete README for Airbnb clone with setup guide`