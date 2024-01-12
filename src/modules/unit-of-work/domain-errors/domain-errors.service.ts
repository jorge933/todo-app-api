import { HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class DomainErrorsService {
  error: string;
  type: string;
  status: HttpStatus | null;

  addError(error: string, type: string, status: HttpStatus) {
    this.type = type;
    this.status = status;
    this.error = error;
  }

  cleanErrors() {
    this.error = '';
    this.type = '';
    this.status = null;
  }
}
