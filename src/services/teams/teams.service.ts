import { HttpStatus, Injectable } from '@nestjs/common';
import { PipelineStage } from 'mongoose';
import { HttpTypeErrors } from 'src/enums/http-type-errors';
import { TeamMembersRepository } from 'src/repositories/team-members/team-members.repository';
import {
  AddUserInTeamDto,
  PromoteUserRoleDto,
} from '../../controllers/teams/teams.dto';
import { TeamRoles } from '../../enums/team-roles';
import { UnitOfWorkService } from '../../modules/unit-of-work/unit-of-work.service';
import { Team } from '../../schemas/team.schema';
import { BaseService } from '../base/base.service';
import { DomainErrorsService } from '../domain-errors/domain-errors.service';

@Injectable()
export class TeamsService extends BaseService<Team> {
  teamMembersRepository: TeamMembersRepository;
  domainErrorsService: DomainErrorsService;

  constructor(private unitOfWork: UnitOfWorkService) {
    super(unitOfWork.teamsRepository);
    this.teamMembersRepository = unitOfWork.teamMembersRepository;
    this.domainErrorsService = unitOfWork.domainErrorsService;
  }

  async createTeam(team: Team) {
    const teamCreated = await this.create(team);
    const teamMembers = await this.teamMembersRepository.create({
      memberId: team.owner,
      teamId: teamCreated.id,
      role: TeamRoles.OWNER,
    });

    delete teamMembers._id;

    teamCreated.members = [teamMembers];

    return teamCreated;
  }

  async getUserTeams(userId: number, queryOptions?: { [key: string]: string }) {
    const { size, page } = queryOptions;
    const options = this.getAggregateOptions({ size, page });

    delete queryOptions.sort;
    delete queryOptions.page;
    delete queryOptions.size;

    const filters = this.transformFilters(queryOptions, 'team');

    const aggregateOptions = [
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
        $match: filters,
      },
      {
        $set: { 'team.id': { $sum: '$team._id' } },
      },
      {
        $unset: ['teamId', '_id', 'team._id', 'memberId'],
      },
      ...(options as PipelineStage[]),
    ];

    return await this.teamMembersRepository.aggregate(aggregateOptions);
  }

  async addUserInTeam(
    userId: number,
    { userToAdd: credentialOfUserToAdd, teamId }: AddUserInTeamDto,
  ) {
    const userToAdd = await this.findUserByAllIdentifiers(
      credentialOfUserToAdd,
    );

    const canAddUser = await this.verifyIfCanAddUser(
      userId,
      userToAdd.id,
      teamId,
    );

    if (!canAddUser) return;

    this.teamMembersRepository.create({
      memberId: userToAdd.id,
      teamId: teamId,
      role: TeamRoles.MEMBER,
    });

    return { message: 'Usuário adicionado com sucesso' };
  }

  private async verifyIfCanAddUser(
    userWhoIsAdding: number,
    idOfUserToAdd: number,
    teamId: number,
  ) {
    const roleOfUser = await this.teamMembersRepository.findOne({
      memberId: userWhoIsAdding,
      teamId,
    });

    if (roleOfUser.role < TeamRoles.ADMIN) {
      this.domainErrorsService.addError(
        {
          message:
            'Você precisa ser administrador ou proprietário do time para adicionar um usuário!',
          type: HttpTypeErrors.INSUFFICIENT_ROLE_TO_THIS_ACTION,
        },
        HttpStatus.UNAUTHORIZED,
      );
      return;
    }

    const userAlreadyParticipant = await this.teamMembersRepository.findOne({
      memberId: idOfUserToAdd,
      teamId,
    });

    if (userAlreadyParticipant) {
      this.domainErrorsService.addError(
        {
          message: 'Este usuário já é participante deste time!',
          type: HttpTypeErrors.USER_ALREADY_PARTICIPANT,
        },
        HttpStatus.UNAUTHORIZED,
      );
      return;
    }

    return true;
  }

  async promoteUserRole(
    userId: number,
    { userToPromote, teamId }: PromoteUserRoleDto,
  ) {
    const { id } = await this.findUserByAllIdentifiers(userToPromote);

    const { role: roleOfUserThatArePromoting } =
      await this.teamMembersRepository.findOne({
        memberId: userId,
        teamId: teamId,
      });

    if (roleOfUserThatArePromoting < TeamRoles.OWNER) {
      this.domainErrorsService.addError(
        {
          message:
            'Para promover um usuário a administrador, você precisa ser o proprietário do time!',
          type: HttpTypeErrors.INSUFFICIENT_ROLE_TO_THIS_ACTION,
        },
        HttpStatus.UNAUTHORIZED,
      );
      return;
    }

    this.teamMembersRepository.updateOne(
      { memberId: id, teamId: teamId },
      { $set: { role: TeamRoles.ADMIN } },
    );

    return { message: 'Usuário promovido com sucesso!' };
  }

  async findUserByAllIdentifiers(credential: unknown) {
    const user = await this.unitOfWork.userRepository.findOne({
      $or: [
        { _id: Number(credential) || -1 },
        { username: credential },
        { email: credential },
      ],
    });
    return user;
  }
}
