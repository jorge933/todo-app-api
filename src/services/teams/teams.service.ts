import { HttpStatus, Injectable } from '@nestjs/common';
import { PipelineStage } from 'mongoose';
import {
  RemoveUserDto,
  UserAndTeamDto,
} from '../../controllers/teams/teams.dto';
import { HttpTypeErrors } from '../../enums/http-type-errors';
import { TeamMembersRepository } from '../../repositories/team-members/team-members.repository';
import { UserRepository } from '../../repositories/user/user.repository';
import { TeamRoles } from '../../enums/team-roles';
import { UnitOfWorkService } from '../../modules/unit-of-work/unit-of-work.service';
import { Team } from '../../schemas/team.schema';
import { BaseService } from '../base/base.service';
import { DomainErrorsService } from '../domain-errors/domain-errors.service';

@Injectable()
export class TeamsService extends BaseService<Team> {
  teamMembersRepository: TeamMembersRepository;
  userRepository: UserRepository;
  domainErrorsService: DomainErrorsService;

  constructor(unitOfWork: UnitOfWorkService) {
    super(unitOfWork.teamsRepository);
    this.teamMembersRepository = unitOfWork.teamMembersRepository;
    this.userRepository = unitOfWork.userRepository;
    this.domainErrorsService = unitOfWork.domainErrorsService;
  }

  async createTeam(userId: number, name: string) {
    const teamCreated = await this.create({
      name,
      owner: userId,
    });
    const member = await this.teamMembersRepository.create({
      memberId: userId,
      role: TeamRoles.OWNER,
      teamId: teamCreated.id,
    });

    teamCreated.members = [member];

    return teamCreated;
  }

  async getUserTeams(userId: number, queryOptions: { [key: string]: string }) {
    const options = this.getAggregateOptions(queryOptions);
    const aggregateExpression: PipelineStage[] = [
      {
        $lookup: {
          from: 'teams',
          localField: 'teamId',
          foreignField: '_id',
          as: 'team',
        },
      },
      {
        $match: {
          memberId: userId,
        },
      },
      {
        $set: { 'team.id': { $sum: '$team._id' } },
      },
      {
        $unset: ['teamId', '_id', 'team._id', 'memberId'],
      },
      ...options,
    ];

    const teams =
      await this.teamMembersRepository.aggregate(aggregateExpression);
    return teams;
  }

  async addUserInTeam(
    idOfUserThatAreAdding: number,
    { credential, teamId }: UserAndTeamDto,
  ) {
    const userThatAreAdding = await this.teamMembersRepository.findOne({
      memberId: idOfUserThatAreAdding,
      teamId,
    });
    const userHasRole = this.userHasRoleToExecuteAction(
      userThatAreAdding?.role,
      TeamRoles.ADMIN,
    );

    if (!userHasRole) return;

    const userToAdd = await this.getUser(credential);

    const userIsParticipantOfTeam = await this.userIsParticipantOfTeam(
      userToAdd.id,
      teamId,
    );

    if (userIsParticipantOfTeam) {
      this.domainErrorsService.addError(
        {
          message: 'Este usuário já está neste time!',
          type: HttpTypeErrors.USER_ALREADY_PARTICIPANT,
        },
        HttpStatus.UNAUTHORIZED,
      );
      return;
    }

    this.teamMembersRepository.create({
      memberId: userToAdd.id,
      teamId,
      role: TeamRoles.MEMBER,
    });

    return { message: 'Usuário adicionado com sucesso!' };
  }

  async promoteUserRole(
    userId: number,
    { credential, teamId }: UserAndTeamDto,
  ) {
    const userThatArePromoting = await this.teamMembersRepository.findOne({
      memberId: userId,
      teamId,
    });
    const userHasRole = this.userHasRoleToExecuteAction(
      userThatArePromoting?.role,
      TeamRoles.OWNER,
    );

    if (!userHasRole) return;

    const userToPromote = await this.getUser(credential);

    if (userToPromote.id == userId) {
      this.domainErrorsService.addError(
        {
          message: 'Você não pode promover você mesmo',
          type: HttpTypeErrors.YOU_CANT_PROMOTE_YOURSELF,
        },
        HttpStatus.FORBIDDEN,
      );
      return;
    }

    this.teamMembersRepository.updateOne(
      { memberId: userToPromote.id, teamId },
      { role: TeamRoles.ADMIN },
    );
    return { message: 'Usuário promovido com sucesso!' };
  }

  async removeUser(userId: number, { id, teamId }: RemoveUserDto) {
    const userAreRemoving = await this.teamMembersRepository.findOne({
      memberId: userId,
      teamId,
    });
    const userToRemove = await this.teamMembersRepository.findOne({
      memberId: id,
      teamId,
    });

    if (!userToRemove || !userAreRemoving) {
      this.domainErrorsService.addError(
        {
          message: 'Usuário inexistente neste time!',
          type: HttpTypeErrors.NON_EXISTING_USER,
        },
        HttpStatus.UNAUTHORIZED,
      );
      return;
    }

    const hasRole = this.userHasRoleToExecuteAction(
      userAreRemoving.role,
      userToRemove.role + 1,
    );

    if (!hasRole) return;

    this.teamMembersRepository.deleteOne({ memberId: id, teamId });
    return { message: 'Usuário removido com sucesso!' };
  }

  async getUser(credential: string) {
    const user = await this.userRepository.findOne({
      $or: [{ username: credential }, { email: credential }],
    });

    return user;
  }

  userHasRoleToExecuteAction(userRole: TeamRoles, necessaryRole: TeamRoles) {
    const hasRole = userRole >= necessaryRole;

    if (!hasRole) {
      this.domainErrorsService.addError(
        {
          message: 'Cargo insuficiente para executar esta ação!',
          type: HttpTypeErrors.INSUFFICIENT_ROLE_TO_THIS_ACTION,
        },
        HttpStatus.FORBIDDEN,
      );
      return;
    }

    return hasRole;
  }

  async userIsParticipantOfTeam(userId: number, teamId: number) {
    const isParticipant = await this.teamMembersRepository.findOne({
      memberId: userId,
      teamId,
    });

    return !!isParticipant;
  }
}
