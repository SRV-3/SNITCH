import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { config } from './config/config.js';

//Routes Import
import authRouter from './routes/auth.routes.js';
import productRouter from './routes/product.routes.js';
import cartRoutes from './routes/cart.routes.js';

//App
const app = express();
app.use(express.static('public'));

//JSON and Cookie Parser Middleware
app.use(express.json());
app.use(cookieParser());

//cors setup
app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

//Passport and GoofleOAuth Stup
app.use(passport.initialize());
passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

//Morgan logs all request
app.use(morgan('dev'));

//ROUTES
app.use('/api/auth', authRouter);
app.use('/api/product', productRouter);
app.use('/api/cart/', cartRoutes);

app.get('*name', (req, res) => {
  res.sendFile(path.join(__dirname, '..', './public/index.html'));
});

export default app;
