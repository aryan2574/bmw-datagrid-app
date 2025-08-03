# Electric Vehicle DataGrid Application

A comprehensive data grid application built for BMW IT Internship, featuring AG Grid with React and Express.js backend for electric vehicle data analysis.

## 🚗 Features

### Frontend (React + AG Grid)

- **Generic DataGrid Component**: Handles electric vehicle data with 15 columns
- **Actions Column**: Default "View" and "Delete" actions for each row
- **Search Functionality**: Real-time search across multiple fields (brand, model, body style, etc.)
- **Advanced Filtering**: Multiple filter operators (contains, equals, starts with, ends with, is empty, greater than, less than)
- **CSV Upload**: Upload and process CSV files directly
- **Responsive Design**: Material-UI components with BMW branding
- **Detail View**: Modal dialog for detailed electric vehicle information

### Backend (Express.js + MySQL)

- **RESTful API**: Complete CRUD operations for electric vehicles
- **Search API**: Backend-powered search functionality
- **Filtering API**: Advanced filtering with multiple operators
- **CSV Processing**: Upload and parse CSV files
- **Database Integration**: MySQL with Sequelize ORM
- **Pagination**: Server-side pagination support
- **API Documentation**: Complete Swagger/OpenAPI documentation

## 🛠️ Technology Stack

### Frontend

- React 19.1.1
- TypeScript 4.9.5
- AG Grid Community 34.1.0
- Material-UI v7.2.0
- Axios 1.11.0 for API communication

### Backend

- Express.js 5.1.0
- TypeScript 5.9.2
- MySQL database
- Sequelize ORM 6.37.7
- Multer 2.0.2 for file uploads
- CSV Parser 3.2.0
- Swagger JSDoc 6.2.8 for API documentation
- Swagger UI Express 5.0.0 for documentation UI

## 📋 Prerequisites

- Node.js (v16 or higher)
- MySQL Server
- npm or yarn

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd bmw-datagrid-app
```

### 2. Database Setup

1. Create a MySQL database:

```sql
CREATE DATABASE bmw_datagrid;
```

2. Update environment variables in `server/.env`:

```env
PORT=5000
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=bmw_datagrid
DB_HOST=localhost
DB_PORT=3306
NODE_ENV=development
```

### 3. Backend Setup

```bash
cd server
npm install
npm run build
npm run dev
```

The server will start on `http://localhost:5000`

### 4. Frontend Setup

```bash
cd client
npm install
npm start
```

The application will start on `http://localhost:3000`

## 📊 Usage

### 1. Upload CSV Data

1. Use the "Upload CSV" button in the application
2. Select the provided `sample_data.csv` file with electric vehicle data
3. The data will be automatically imported into the database

### 2. Search and Filter

- **Search**: Use the search bar to find electric vehicles across multiple fields
- **Filters**: Click "Add Filter" to apply specific column filters
- **Active Filters**: View and remove active filters using the chip display

### 3. DataGrid Features

- **Sorting**: Click column headers to sort data
- **Pagination**: Navigate through pages of data
- **Actions**: Use View/Delete buttons for each row
- **Responsive**: Grid adapts to different screen sizes

## 🔧 Available Scripts

### Backend Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm run start        # Start production server
npm run clean        # Clean build directory
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
```

### Frontend Scripts

```bash
npm start            # Start development server
npm run build        # Build for production
npm test             # Run tests
npm run eject        # Eject from Create React App
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run type-check   # Run TypeScript type checking
```

## 📚 API Documentation

The API includes comprehensive Swagger/OpenAPI documentation accessible at:

**http://localhost:5000/api-docs**

### API Documentation Features:

- **Interactive Documentation**: Test API endpoints directly from the browser
- **Request/Response Examples**: See example requests and responses
- **Schema Definitions**: Complete data model documentation
- **Error Responses**: Documented error scenarios and codes
- **Authentication**: Ready for future authentication implementation

### Available Endpoints:

#### Vehicles

- `GET /api/v1/vehicles` - Get all vehicles with search/filter/pagination
- `GET /api/v1/vehicles/:id` - Get vehicle by ID
- `POST /api/v1/vehicles` - Create new vehicle
- `PUT /api/v1/vehicles/:id` - Update vehicle
- `DELETE /api/v1/vehicles/:id` - Delete vehicle

#### CSV Upload

- `POST /api/v1/upload-csv` - Upload and process CSV file

#### Health Check

- `GET /api/v1/test` - Test API connectivity

## 🔧 API Endpoints

### Vehicles

- `GET /api/v1/vehicles` - Get all electric vehicles with search/filter
- `GET /api/v1/vehicles/:id` - Get vehicle by ID
- `POST /api/v1/vehicles` - Create new vehicle
- `PUT /api/v1/vehicles/:id` - Update vehicle
- `DELETE /api/v1/vehicles/:id` - Delete vehicle

### CSV Upload

- `POST /api/v1/upload-csv` - Upload and process CSV file

### Test

- `GET /api/v1/test` - Test API connectivity

## 📁 Project Structure

```
bmw-datagrid-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── DataGrid.tsx
│   │   ├── App.tsx
│   │   └── index.tsx
│   └── package.json
├── server/                 # Express.js backend
│   ├── models/
│   │   ├── index.ts
│   │   └── Vehicle.ts
│   ├── routes/
│   │   └── vehicles.ts
│   ├── config/
│   │   └── config.json
│   ├── app.ts
│   ├── .eslintrc.js
│   └── package.json
├── sample_data.csv         # Sample electric vehicle data
└── README.md
```

## 🎨 Features Implemented

### ✅ Core Requirements

- [x] Generic DataGrid component with 15 columns for electric vehicle data
- [x] Actions column with View and Delete functionality
- [x] Search functionality using backend API
- [x] Advanced filtering with multiple operators
- [x] Express.js backend with MySQL database
- [x] CSV file upload and processing
- [x] Complete API documentation with Swagger/OpenAPI

### ✅ Electric Vehicle Data Fields

- [x] Brand (Manufacturer)
- [x] Model (Vehicle model)
- [x] Acceleration (0-100 km/h in seconds)
- [x] Top Speed (km/h)
- [x] Range (km)
- [x] Efficiency (kWh/100km)
- [x] Fast Charging Speed (km/h)
- [x] Rapid Charging Availability (Yes/No)
- [x] Power Train (RWD/AWD/FWD)
- [x] Plug Type (Type 2 CCS/Type 1 CHAdeMO)
- [x] Body Style (Sedan, SUV, Hatchback, etc.)
- [x] Segment (A, B, C, D, E, F)
- [x] Seats (Number of seats)
- [x] Price (Euro)
- [x] Date (Listing date)

### ✅ Additional Features

- [x] Material-UI styling with BMW branding
- [x] Responsive design
- [x] Pagination support
- [x] Real-time search
- [x] Advanced filtering UI
- [x] Detail view modal
- [x] Status indicators with color coding
- [x] File upload with progress
- [x] Error handling and validation
- [x] ESLint configuration for code quality
- [x] TypeScript type checking
- [x] Swagger API documentation
- [x] Interactive API testing interface

## 🧪 Testing

### Backend Testing

```bash
cd server
npm run dev
# Test API endpoints using Postman or curl
# Or visit http://localhost:5000/api-docs for interactive testing
```

### Frontend Testing

```bash
cd client
npm start
# Open http://localhost:3000 in browser
```

## 📝 Sample Data

The application includes a `sample_data.csv` file with 15 electric vehicles including:

- Various brands (Tesla, BMW, Volkswagen, Audi, Mercedes, etc.)
- Different body styles (Sedan, SUV, Hatchback, Liftback)
- Multiple performance specifications (acceleration, range, efficiency)
- Realistic pricing and technical specifications

## 🔒 Environment Variables

### Frontend (.env)

```
REACT_APP_API_BASE_URL=http://localhost:5000/api/v1
```

### Backend (.env)

```
PORT=5000
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=bmw_datagrid
DB_HOST=localhost
DB_PORT=3306
NODE_ENV=development
```

## 🚀 Deployment

### Development

```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm start
```

### Production

```bash
# Backend
cd server && npm run build && npm start

# Frontend
cd client && npm run build
```

## 📞 Support

For any issues or questions regarding the Electric Vehicle DataGrid application, please contact the development team.

---

**Developed for BMW IT Internship Position**  
_Battery Cell Competence Center_
