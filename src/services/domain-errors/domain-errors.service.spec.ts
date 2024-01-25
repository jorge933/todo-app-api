import { Test, TestingModule } from '@nestjs/testing';
import { DomainErrorsService } from './domain-errors.service';
import { HttpTypeErrors } from '../../enums/http-type-errors';
import { HttpStatus } from '@nestjs/common';

fdescribe('DomainErrorsService', () => {
  let service: DomainErrorsService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DomainErrorsService],
    }).compile();
    service = module.get<DomainErrorsService>(DomainErrorsService);
  });

  it('should be add error and change status', () => {
    const status = HttpStatus.UNAUTHORIZED;
    service.addError(
      {
        message: 'Credenciais Inválidas',
        type: HttpTypeErrors.INVALID_CREDENTIALS,
      },
      status,
    );

    const expectedErrorsLength = 1;

    expect(service.errors.length).toBe(expectedErrorsLength);
    expect(service.status).toBe(status);
  });

  it('should clean errors and status', () => {
    service.cleanErrors();
    const expectedErrorsLength = 0;
    const expectedStatus = null;

    expect(service.errors.length).toBe(expectedErrorsLength);
    expect(service.status).toBe(expectedStatus);
  });
});
