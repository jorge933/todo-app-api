import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { DomainErrorsService, Error } from './domain-errors.service';
import { HttpTypeErrors } from '../../enums/http-type-errors';

describe('DomainErrorsService', () => {
  let service: DomainErrorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DomainErrorsService],
    }).compile();

    service = module.get<DomainErrorsService>(DomainErrorsService);
  });

  it('should add an error', () => {
    const error: Error = {
      message: 'Credenciais Inválidas',
      type: HttpTypeErrors.INVALID_CREDENTIALS,
    };
    const status = HttpStatus.UNAUTHORIZED;

    service.addError(error, status);

    expect(service.errors).toContain(error);
    expect(service.status).toBe(status);
  });

  it('should clean errors', () => {
    const error: Error = {
      message: 'Credenciais Inválidas',
      type: HttpTypeErrors.INVALID_CREDENTIALS,
    };
    const status = HttpStatus.UNAUTHORIZED;

    service.addError(error, status);
    service.cleanErrors();

    expect(service.errors).toHaveLength(0);
    expect(service.status).toBeNull();
  });

  it('should store errors and status correctly', () => {
    const error1: Error = {
      message: 'Nenhum registro encontrado!',
      type: HttpTypeErrors.NO_DOCUMENTS_FIND,
    };
    const error2: Error = {
      message: 'Este usuário não existe!',
      type: HttpTypeErrors.NO_DOCUMENTS_FIND,
    };
    const status = HttpStatus.NOT_FOUND;

    service.addError(error1, status);
    service.addError(error2, status);

    expect(service.errors).toContain(error1);
    expect(service.errors).toContain(error2);
    expect(service.status).toBe(status);
  });

  it('should clear errors and status together', () => {
    const error: Error = {
      message: 'Este usuário não existe',
      type: HttpTypeErrors.NO_DOCUMENTS_FIND,
    };
    const status = HttpStatus.NOT_FOUND;

    service.addError(error, status);
    service.cleanErrors();

    expect(service.errors).toHaveLength(0);
    expect(service.status).toBeNull();
  });
});
