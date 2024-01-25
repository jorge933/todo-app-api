import { Test, TestingModule } from '@nestjs/testing';
import { UNIT_OF_WORK_PROVIDERS } from '../constants/unit-of-work-providers';
import { DomainErrorsService } from '../services/domain-errors/domain-errors.service';
import { ResponseInterceptor } from './response-interceptor';
import { ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { HttpTypeErrors } from '../enums/http-type-errors';

describe('ResponseInterceptor', () => {
  let interceptor: ResponseInterceptor;
  let callHandlerMock: { handle: jest.Mock };
  let domainErrorsService: DomainErrorsService;
  let executionContext: ExecutionContext;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResponseInterceptor, ...UNIT_OF_WORK_PROVIDERS],
    }).compile();

    interceptor = module.get<ResponseInterceptor>(ResponseInterceptor);
    domainErrorsService = module.get<DomainErrorsService>(DomainErrorsService);
    callHandlerMock = { handle: jest.fn() };
  });

  it('should format successful response', () => {
    const data = { result: 'success' };
    executionContext = {
      switchToHttp: () => ({
        getResponse: () => ({
          statusCode: HttpStatus.OK,
        }),
      }),
    } as ExecutionContext;

    callHandlerMock.handle.mockReturnValue(of(data));

    const result$ = interceptor.intercept(executionContext, callHandlerMock);

    result$.subscribe((result) => {
      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Operação realizada com sucesso!',
        data,
        success: true,
      });
    });
  });

  it('should handle http exception', () => {
    const message = 'Error';
    const requestError = new Observable((observer) => {
      observer.error(new HttpException(message, HttpStatus.BAD_REQUEST));
    });

    callHandlerMock.handle.mockReturnValue(requestError);
    executionContext = {
      switchToHttp: () => ({
        getResponse: () => ({
          statusCode: HttpStatus.BAD_REQUEST,
          status: jest.fn().mockImplementation(() => {
            return { json: jest.fn().mockImplementation((value) => value) };
          }),
        }),
      }),
    } as ExecutionContext;

    const result$ = interceptor.intercept(executionContext, callHandlerMock);

    const expectedResult = {
      status: HttpStatus.BAD_REQUEST,
      message,
      success: false,
    };

    result$.subscribe({
      error: (result) => expect(expectedResult).toEqual(result),
    });
  });

  it('should handle exception errors', () => {
    const error = {
      message: 'name deve ser uma string',
      property: 'name',
    };
    const requestError = new Observable((observer) => {
      observer.error([error]);
    });

    callHandlerMock.handle.mockReturnValue(requestError);
    executionContext = {
      switchToHttp: () => ({
        getResponse: () => ({
          statusCode: HttpStatus.BAD_REQUEST,
          status: jest.fn().mockImplementation(() => {
            return { json: jest.fn().mockImplementation((value) => value) };
          }),
        }),
      }),
    } as ExecutionContext;

    const result$ = interceptor.intercept(executionContext, callHandlerMock);

    result$.subscribe({
      error: (error) =>
        expect({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: [error],
          success: false,
        }).toEqual(error),
    });
  });
});
