import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeederService } from '@app/seeder';
import { VersionInterceptor } from './version.interceptor';
import * as dotenv from 'dotenv'; // Import dotenv
import * as Sentry from '@sentry/node';
dotenv.config(); // Load environment variables from .env file
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const version = process.env.APP_VERSION?.toLowerCase() || 'v1'; // Get and lowercase version from .env file, provide a default if not set
  app.useGlobalInterceptors(new VersionInterceptor(version));
  Sentry.init({
    dsn: "https://d0daea2ea0e9e62bd4dd83d4ace71c17@o4505781594750976.ingest.sentry.io/4505781595996160",

    // Performance Monitoring
    tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
  });
  await app.listen(3000);
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
}
bootstrap();
