import { Test, TestingModule } from '@nestjs/testing';
import { WhislistsService } from './whislists.service';

describe('WhislistsService', () => {
  let service: WhislistsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WhislistsService],
    }).compile();

    service = module.get<WhislistsService>(WhislistsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
