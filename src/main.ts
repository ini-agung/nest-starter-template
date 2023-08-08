import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeederService } from '@app/seeder';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
}
bootstrap();
