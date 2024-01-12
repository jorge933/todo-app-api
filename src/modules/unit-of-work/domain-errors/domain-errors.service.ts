import { Injectable } from '@nestjs/common';
export interface Error {
  message: string;
}

@Injectable()
export class DomainErrorsService {
  errors: Error[] = [];

  addError(error: Error) {
    this.errors.push(error);
  }

  cleanErrors() {
    this.errors = [];
  }
}
