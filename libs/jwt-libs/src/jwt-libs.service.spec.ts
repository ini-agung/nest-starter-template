import { Test, TestingModule } from '@nestjs/testing';
import { JwtLibsService } from './jwt-libs.service';

describe('JwtLibsService', () => {
  let service: JwtLibsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtLibsService],
    }).compile();

    service = module.get<JwtLibsService>(JwtLibsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
