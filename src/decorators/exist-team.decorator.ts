import { Injectable } from '@nestjs/common';

import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { TeamsRepository } from '../repositories/teams/teams.repository';

@ValidatorConstraint({ name: 'teamValidator', async: true })
@Injectable()
export class ExistTeamValidation implements ValidatorConstraintInterface {
  constructor(private readonly teamsRepository: TeamsRepository) {}

  async validate(id: number): Promise<boolean> {
    const team = await this.teamsRepository.findOne({ _id: id });

    return !!team;
  }
}

export function IsValidTeam(options?: ValidationOptions) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: 'Este time não existe!',
        ...options,
      },
      validator: ExistTeamValidation,
    });
  };
}
