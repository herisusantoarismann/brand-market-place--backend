import { Test, TestingModule } from '@nestjs/testing';
import { WhislistsController } from './whislists.controller';

describe('WhislistsController', () => {
  let controller: WhislistsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WhislistsController],
    }).compile();

    controller = module.get<WhislistsController>(WhislistsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
