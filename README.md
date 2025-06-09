# 🐾DogFinder - Fetch Frontend Take-Home Exercise Solution

Live Demo: [DogFinder on GitHub Pages](https://ashu05g.github.io/Fetch_takeHome_Ashutosh/)

This is my solution to the Fetch Frontend Take-Home Exercise. The challenge was to create a web application that helps users search through a database of shelter dogs to find potential adoptions. I've built a modern, responsive application that not only meets all the requirements but also adds several enhanced features for a better user experience.

## Exercise Requirements and Implementation

### ✅ Authentication
- Implemented a login screen that collects user's name and email
- Integrated with `/auth/login` endpoint for authentication
- Added secure session management with HttpOnly cookies
- Implemented logout functionality

### ✅ Search & Filter Requirements
- **Breed Filtering**: 
  - Implemented searchable dropdown with all available breeds
  - Support for multiple breed selection
  - Real-time breed search filtering
  - Integrated with `/dogs/breeds` endpoint

- **Pagination**:
  - Efficient pagination with 20 dogs per page
  - Dynamic page navigation with ellipsis for large result sets
  - Smooth scrolling between pages
  - Proper handling of `from` and `size` parameters

- **Sorting**:
  - Default sorting by breed (alphabetically)
  - Added sorting options:
    - Breed (A-Z and Z-A)
    - Age (Youngest and Oldest)
  - Implemented using the `sort` parameter with proper field:direction syntax

- **Dog Information Display**:
  - All fields from the Dog object are displayed:
    - Name
    - Breed
    - Age
    - Location (zip code)
    - Image
  - Attractive card-based layout with hover effects

### ✅ Favorites & Matching
- Implemented favorite selection with heart icons
- Visual feedback for selected favorites
- "Find Match" feature using `/dogs/match` endpoint
- Celebratory match presentation with confetti animation
- Requires minimum of 2 favorites for matching

### 🌟 Additional Features

#### 🗺️ Advanced Location Search
Implemented an interactive map-based location search using the `/locations/search` endpoint:

- Built with Leaflet.js for smooth map interactions
- Interactive selection rectangle that:
  - Maintains consistent screen size while zooming
  - Updates coordinates in real-time
  - Converts geographic area to zip codes
- Combines with manual zip code entry
- Integrates with the main search functionality

#### 💅 Enhanced UI/UX
- Responsive design for all screen sizes
- Smooth animations using Framer Motion
- Loading states and error handling
- Accessible design with ARIA labels
- Modern color scheme with purple accents

## Technical Details

### API Integration
Implemented all required endpoints:

1. **Authentication**:
   - POST `/auth/login`
   - POST `/auth/logout`

2. **Dog Data**:
   - GET `/dogs/breeds`
   - GET `/dogs/search`
   - POST `/dogs`
   - POST `/dogs/match`

3. **Location Services**:
   - POST `/locations/search`
   - POST `/locations`

### Tech Stack
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Leaflet.js
- React Query
- React Hot Toast
- React Modal

# Screenshots:
## Login:
![image](https://github.com/user-attachments/assets/aa16a307-f2ff-4e72-b227-1d6d5e6a296d)
![image](https://github.com/user-attachments/assets/6d1ca55b-c2b9-4851-84f4-ebbc4c89e18f)

## Home/Search:
![Screenshot 2025-06-09 031204](https://github.com/user-attachments/assets/d5d8a05b-5b6d-4e9a-8fcb-2157d6dfb587)

## Searching:
![Screenshot 2025-06-09 031749](https://github.com/user-attachments/assets/406ed0ce-bad4-47a2-9252-b062b0bce6be)

## Select Area on Map:
![Screenshot 2025-06-09 031836](https://github.com/user-attachments/assets/20698588-d765-4a54-8ab5-0db7571a0d46)

## Select fav:
![Screenshot 2025-06-09 031918](https://github.com/user-attachments/assets/303d5b98-521f-4f49-a3ad-5d4f25cabba7)

## Match:
![Screenshot 2025-06-09 031944](https://github.com/user-attachments/assets/8f4673f5-4685-4173-b27d-e98c384d0e5f)

## Running Locally

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/ashutosh-rath02/Fetch_takeHome_Ashutosh.git
   cd Fetch_takeHome_Ashutosh
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```bash
   http://localhost:5173/Fetch_takeHome_Ashutosh
   ```

### Environment Setup
No additional environment variables are required as the API endpoints are preconfigured.

## Project Structure
```
fetch-dogfinder-Take-Home/
├── src/
│   ├── components/
│   │   └── MapSelector/
│   │       ├── MapSelector.tsx
│   │       └── MapSelector.css
│   ├── pages/
│   │   ├── Login.tsx
│   │   └── Search.tsx
│   ├── services/
│   │   └── api.ts
│   ├── context/
│   │   └── AuthContext.tsx
│   └── types/
│       └── index.ts
├── public/
└── package.json
```

## Future Enhancements
- Save favorites to local storage for persistence
- Add more detailed dog information views
- Implement user profiles and preferences
- Add sharing functionality for matched dogs
- Enhance map selection with shape drawing tools

## Credits
- OpenStreetMap for map data
- Fetch API for dog and location data
