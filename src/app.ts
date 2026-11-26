import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { requestLogger } from './middlewares/logger.middleware';
import apiRoutes from './routes';
import { globalErrorHandler } from './middlewares/errorHandler.middleware';

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.get('/api/v1/health', (_req: Request, res: Response): void => {
  res.status(200).json({
    status: 'success',
    message: 'ControlLabs API operando correctamente',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/v1', apiRoutes);

if (process.env.NODE_ENV !== 'production') {
  app.get(
    '/__test/error',
    (_req: Request, _res: Response, next: NextFunction): void => {
      next(new Error('Error de prueba'));
    }
  );
}

app.use((_req: Request, res: Response): void => {
  res.status(404).json({ success: false, error: 'Ruta no encontrada.' });
});

app.use(globalErrorHandler);

export default app;
