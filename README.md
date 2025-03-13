# opinion-trading-backend
Opinion trading system for gotosioc

Backend system for an opinion trading app built with Node.js, Express, MongoDB, and Socket.io.

## Setup
1. Clone the repo: `git clone <repo-url>`
2. Install dependencies: `npm install`
3. Create a `.env` file with:
 MONGO_URI=mongodb+srv://rachityadav342:********@cluster0.tefbf.mongodb.net/opinion-trading?retryWrites=true&w=majority
 JWT_SECRET=your-secret-key
 PORT=3000 
 
4. Start MongoDB Atlas to check collections.
5. Run the server: `npm start`

## API Endpoints
- **POST /api/auth/register**: Register a user (`{ username, password }`).
- **POST /api/auth/login**: Login and get JWT token.
- **GET /api/admin/events**: List events (admin only).
- **POST /api/admin/events**: Create event (admin only).
- **GET /api/admin/trades**: List trades (admin only).
- **POST /api/trades**: Place a trade (`{ eventId, option, amount }`).

## Architecture
- **MVC Pattern**: Routes handle requests, models define schemas, services contain logic.
- **Data Flow**: External API → MongoDB → WebSocket → Clients.
- **Challenges**: Simulated live data due to lack of free API; WebSocket latency minimized with efficient event emission.

## Notes
- Use Postman to test APIs with JWT token in `Authorization` header.
- WebSocket updates every 30 seconds with mock data.
