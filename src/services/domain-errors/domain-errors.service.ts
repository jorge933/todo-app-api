import { HttpStatus, Injectable } from '@nestjs/common';
import { HttpTypeErrors } from '../../enums/http-type-errors';
export interface Error {
  message: string;
  type: HttpTypeErrors;
}

@Injectable()
export class DomainErrorsService {
  errors: Error[] = [];
  status: HttpStatus | null;

  addError(error: Error, status: HttpStatus) {
    this.errors.push(error);
    this.status = status;
  }

  cleanErrors() {
    this.errors = [];
    this.status = null;
  }
}
