import { BadRequestException, Injectable } from '@nestjs/common';
import { ConceptType, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConceptDto } from './dto/create-concept.dto';
import { UpdateConceptDto } from './dto/update-concept.dto';
import { responseData, responseError } from 'src/common/utils/response.util';
import { ListConceptsDto } from './dto/list-concepts.dto';

@Injectable()
export class ConceptService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createConceptDto: CreateConceptDto) {
    try {
      const { description, type, company_id } = createConceptDto;
      const concept = await this.prisma.concept.create({
        data: {
          description,
          type,
          company: { connect: { id: company_id } },
        },
      });
      return responseData(concept, 'Se ha creado el concepto correctamente.', 201);
    } catch (e) {
      return responseError(e, 'No se pudo crear el concepto.');
    }
  }

  async findAll() {
    try {
      const concepts = await this.getConcepts();
      return responseData(concepts, 'Listado de los conceptos');
    } catch (e) {
      return responseError(e, 'No se pudo obtener el listado de conceptos.');
    }
  }

  async list(listConceptsDto: ListConceptsDto) {
    const { companyId, type } = listConceptsDto;
    try {      
      if (!companyId || !type) {
        throw new BadRequestException('company_id y type son requeridos');
      }
      const concepts = await this.getConcepts(companyId, type);
      return responseData(concepts, `Listado de los conceptos de ${type}`);
    } catch (e) {
      return responseError(e, 'No se pudo obtener el listado de conceptos.');
    }
  }

  async findOne(id: number) {
    try {
      const concept = await this.prisma.concept.findUniqueOrThrow({ where: { id } });
      return responseData(concept, `Detalles del concepto: ${id}.`);
    } catch (e) {
      return responseError(e, `No se pudo obtener el concepto: ${id}.`);
    }
  }

  async update(id: number, updateConceptDto: UpdateConceptDto) {
    try {
      const { company_id, ...fields } = updateConceptDto;
      const data: Prisma.ConceptUpdateInput = {
        ...fields,
        ...(company_id !== undefined && { company: { connect: { id: company_id } } }),
      };
      const concept = await this.prisma.concept.update({
        where: { id },
        data,
      });
      return responseData(concept, 'Se ha actualizado el concepto correctamente.');
    } catch (e) {
      return responseError(e, 'No se pudo actualizar el concepto.');
    }
  }

  async remove(id: number) {
    try {
      const concept = await this.prisma.concept.delete({ where: { id } });
      return responseData(concept, 'Se ha eliminado el concepto correctamente.');
    } catch (e) {
      return responseError(e, `No se pudo eliminar el concepto: ${id}.`);
    }
  }

  private async getConcepts(companyId?: number, type?: ConceptType) {
    return this.prisma.concept.findMany({
      where: {
        ...(companyId !== undefined && { companyId: companyId }),
        ...(type !== undefined && { type }),
      },
    });
  }
}
