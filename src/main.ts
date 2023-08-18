import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeederService } from '@app/seeder';
import { VersionInterceptor } from './version.interceptor';
import * as dotenv from 'dotenv'; // Import dotenv
dotenv.config(); // Load environment variables from .env file
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const version = process.env.APP_VERSION?.toLowerCase() || 'v1'; // Get and lowercase version from .env file, provide a default if not set
  app.useGlobalInterceptors(new VersionInterceptor(version));

  await app.listen(3000);
  //*
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
