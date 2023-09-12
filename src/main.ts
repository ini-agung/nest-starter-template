import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeederService } from '@app/seeder';
import * as dotenv from 'dotenv'; // Import dotenv
import * as Sentry from '@sentry/node';
import { Logger } from '@nestjs/common';
import { logLever } from '@app/helper';
import helmet from 'helmet';
import * as csurf from 'csurf';


dotenv.config(); // Load environment variables from .env file
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  Sentry.init({
    dsn: "https://d0daea2ea0e9e62bd4dd83d4ace71c17@o4505781594750976.ingest.sentry.io/4505781595996160",
    tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
  });
  app.useLogger(new Logger(logLever()));
  app.use(helmet({
    xXssProtection: true,
  }));
  app.use(csurf());
  await app.listen(3000);
  /*
  try {
    const seederService = app.get(SeederService);
    await seederService.seed();
    await app.close();
  } catch (error) {
    console.error('Error occurred while seeding:', error);
    await app.close();
  }
  //*/

  /*
    const transaction = Sentry.startTransaction({
      op: "test",
      name: "My First Test Transaction",
    });
  
    setTimeout(() => {
      try {
        fooasd();
      } catch (e) {
        Sentry.captureException(e);
      } finally {
        transaction.finish();
      }
    }, 99);
    //*/

}
bootstrap();
