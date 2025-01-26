# Real Estate Platform

A comprehensive real estate platform built with Next.js, Sanity CMS, and AI-powered price prediction models. The platform allows users to list properties for rent, sale, or plot and includes features like price predictions, user authentication, and property management.

## Features

### Property Listings
- Create, view, and manage property listings
- Support for three categories: Rent, Buy (Sale), and Plot
- Rich media support with multiple image uploads
- Detailed property information including area, BHK, bathrooms, etc.
- Location-based property search and filtering

### AI-Powered Price Predictions
- Rent price prediction using ML model
- Buy price prediction using historical data analysis
- Location-based price recommendations
- Price per square foot calculations
- Real-time price estimates

### User Features
- Google Authentication
- User profiles
- Property wishlist
- Property application system
- Property management dashboard

### Location Services
- Address autocomplete
- Geocoding support
- District and city-based search
- Location-based property recommendations

### Admin Features
- Property listing management
- User management
- Application tracking system
- Property status management (sold/rented)

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Sanity.io
- **Authentication**: NextAuth.js with Google provider
- **Location Services**: Geoapify API
- **Price Prediction**: Custom ML models
- **Image Storage**: Sanity Asset Pipeline
- **Styling**: Shadcn UI Components

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm/yarn
- Sanity CLI
- Google Cloud Console account
- Geoapify API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/real-estate-platform.git
cd real-estate-platform
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

4. Fill in the environment variables in `.env.local`

5. Run the development server
```bash
npm run dev
```

6. Start the Sanity Studio
```bash
cd sanity
npm install
npm run dev
```

### Environment Variables

Create a `.env.local` file with the following variables (see .env.example for details):
- Authentication credentials
- Sanity project configuration
- API keys
- Model endpoints

## Project Structure

```
├── app/                  # Next.js app directory
│   ├── api/             # API routes
│   ├── (root)/         # Public routes
│   └── dashboard/      # Protected routes
├── components/          # React components
├── lib/                 # Utility functions
├── public/             # Static assets
└── sanity/             # Sanity CMS configuration
```

## Features in Detail

### Property Listing System
- Detailed property information capture
- Multiple image upload support
- Location-based data
- Category-specific fields
- Price recommendation system

### User Management
- Google OAuth integration
- User profiles with property history
- Saved properties feature
- Application tracking

### Price Prediction Models
- Rent prediction based on:
  - Location
  - Property size
  - Amenities
  - Historical data
- Buy prediction based on:
  - Location (district/city)
  - Property size
  - Market trends
  - Comparable properties

### Location Services
- Address autocomplete
- Geocoding
- Reverse geocoding
- District/city detection

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
