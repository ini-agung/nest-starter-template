import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { seedDatabase } from './_db/seeding';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  // await seedDatabase();
}
bootstrap();
