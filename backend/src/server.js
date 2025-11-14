import mongoose from 'mongoose';
import { app } from './app.js';
import { config } from './config/index.js';

const start = async () => {
  try {
mongoose.connect(config.mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected!'))
  .catch(err => console.error('Error:', err));


    app.listen(config.port, () => {
      // eslint-disable-next-line no-console
      console.log(`🚀 Server ready on port ${config.port}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

start();

