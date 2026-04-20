import app from './src/app.js';
import conectToDb from './src/config/database.js';

const startServer = () => {
  conectToDb();
  try {
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
