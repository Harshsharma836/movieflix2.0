import { Router } from 'express';
import {
  searchMoviesController,
  getMovieByIdController,
} from '../controllers/movie.controller.js';

const movieRouter = Router();

movieRouter.get('/', searchMoviesController);
movieRouter.get('/:id', getMovieByIdController);

export { movieRouter };

