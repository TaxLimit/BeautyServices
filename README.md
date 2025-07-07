To install all Dependencies - npm i (both in front and back folders)


To start the Backend - npm start

To start the Frontend - npm run dev

PostgresDB PORT - 3000

NodeJS Backend Server PORT - 3002 || 3003

Frontend Vite Application running on  http://localhost:5173/

You can create users with User / Admin roles during the registration which have seperate authorization to different REST API CRUD functionalities 

Usernames are unique, so are emails

Password -  Must contain at least one number, one uppercase, one lowercase, and be 8+ characters long

The passwords are encrypted with argon2 hash, the web app uses jwebtoken for cookies and sequelize to handle database queries and postgres usage, routes are protected and theres sanitization on every input field.

The Admin can create services, delete them, add dates for them, which they or the users can RSVP ( reserve ), they can edit them as well.

The Users can reserve dates ( multiple users can reserve the same dates ) , they can view their reservations and cancel them if neeeded. 

Guests are free to view all available services , filter by category and search for specific services and see available times, but they need to login before they can reserve ( auth prevents it )





