# PurelyCart - Modern E-commerce Platform


PurelyCart is a full-featured e-commerce platform built with Next.js, offering a seamless shopping experience with a beautiful, responsive interface. This application combines modern design, robust functionality, and efficient performance to deliver an exceptional online shopping solution.

## Features

### 🛍️ Intuitive Shopping Experience

- **Product Showcase**: Elegant product displays with high-quality images, detailed descriptions, and variant options
- **Color Variants**: Browse products in different colors with an intuitive color picker interface
- **Dynamic Filtering**: Filter products by tags
- **Responsive Design**: Optimized shopping experience on all devices

### 🔍 Advanced Search

- **Algolia Integration**: Lightning-fast search with typo tolerance and instant results
- **Search Highlighting**: Highlighted matching terms in search results
- **Search Suggestions**: Intelligent suggestions as you type

### 🛒 Smart Shopping Cart

- **Real-time Updates**: Cart updates instantly when adding or removing items
- **Quantity Management**: Easily adjust product quantities
- **Price Calculations**: Automatic price updates with elegant animations
- **Persistent Cart**: Cart data persists between sessions

### 💳 Streamlined Checkout

- **Multi-step Process**: Intuitive checkout flow with progress indicators
- **Secure Payments**: Integrated with Stripe for secure payment processing


### 👤 User Accounts

- **Multiple Authentication Methods**: Register with email or sign in with Google/GitHub
- **Two-Factor Authentication**: Enhanced security with 2FA option
- **Profile Management**: Update personal information, avatar, and preferences
- **Order History**: View and track past orders

### 🌙 Personalized Experience

- **Theme Switching**: Toggle between light and dark modes
- **Responsive Design**: Optimized for all screen sizes
- **Animated Interactions**: Smooth transitions and micro-animations for a polished feel

### 📊 Product Reviews

- **Star Ratings**: Visual star rating system
- **Review Charts**: Statistical breakdown of product ratings
- **User Reviews**: Detailed customer feedback with user information

### ⚙️ Admin Dashboard

- **Product Management**: Add, edit, and delete products
- **Variant Control**: Create and manage product variants with different colors and types
- **Image Management**: Upload and arrange product images with drag-and-drop functionality
- **Analytics**: Track sales=

### 📦 Order Management

- **Order Tracking**: Real-time updates on order status
- **Order History**: Complete history of all purchases


## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **State Management**: React Hooks, Zustand
- **Styling**: Shadcn UI components, Tailwind CSS, Framer Motion
- **Authentication**: NextAuth.js
- **Database**: PostgreSQL with Drizzle ORM
- **Search**: Algolia
- **Payments**: Stripe
- **Image Uploads**: UploadThing
- **Rich Text Editing**: TipTap

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- Stripe account
- Algolia account
- UploadThing account

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Tawfik-Tarek/PurelyCart.git
   cd purely-cart
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the necessary environment variables

4. Set up the database:

   ```bash
   npm run db:push
   ```

5. Run the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `/app`: Next.js app router pages and layouts
- `/components`: Reusable React components
- `/server`: Server-side code, API routes, and database schema
- `/lib`: Utility functions and client-side stores
- `/public`: Static assets
- `/utils`: Helper utilities

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Stripe](https://stripe.com/)
- [Algolia](https://www.algolia.com/)
- [Drizzle ORM](https://orm.drizzle.team/)

---

Developed with ❤️ by Tawfik Tarek
