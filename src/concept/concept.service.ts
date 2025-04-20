import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { Concept, ConceptType, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConceptDto } from './dto/create-concept.dto';
import { UpdateConceptDto } from './dto/update-concept.dto';
import { DataResponse, responseData, responseError } from 'src/common/utils/response.util';
import { ListConceptsDto } from './dto/list-concepts.dto';

@Injectable()
export class ConceptService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createConceptDto: CreateConceptDto): Promise<DataResponse<Concept>> {
    try {
      const { description, type, companyId } = createConceptDto;
      const concept = await this.prisma.concept.create({
        data: {
          description,
          type,
          company: { connect: { id: companyId } },
        },
      });
      return responseData(concept, 'Se ha creado el concepto correctamente.', HttpStatus.CREATED);
    } catch (e) {
      throw responseError(e, 'No se pudo crear el concepto.');
    }
  }

  async findAll(): Promise<DataResponse<Concept[]>> {
    try {
      const concepts = await this.getConcepts();
      return responseData(concepts, 'Listado de los conceptos');
    } catch (e) {
      throw responseError(e, 'No se pudo obtener el listado de conceptos.');
    }
  }

  async list(listConceptsDto: ListConceptsDto): Promise<DataResponse<Concept[]>> {
    const { companyId, type } = listConceptsDto;
    try {      
      if (!companyId || !type) {
        throw new BadRequestException('companyId y type son requeridos');
      }
      const concepts = await this.getConcepts(companyId, type);
      return responseData(concepts, `Listado de los conceptos de ${type}`);
    } catch (e) {
      throw responseError(e, 'No se pudo obtener el listado de conceptos.');
    }
  }

  async findOne(id: number): Promise<DataResponse<Concept>> {
    try {
      const concept = await this.prisma.concept.findUniqueOrThrow({ where: { id } });
      return responseData(concept, `Detalles del concepto: ${id}.`);
    } catch (e) {
      throw responseError(e, `No se pudo obtener el concepto: ${id}.`, HttpStatus.NOT_FOUND);
    }
  }

  async update(id: number, updateConceptDto: UpdateConceptDto): Promise<DataResponse<Concept>> {
    await this.findOne(id);
    try {
      const { companyId, ...fields } = updateConceptDto;
      const data: Prisma.ConceptUpdateInput = {
        ...fields,
        ...(companyId !== undefined && { company: { connect: { id: companyId } } }),
      };
      const concept = await this.prisma.concept.update({
        where: { id },
        data,
      });
      return responseData(concept, 'Se ha actualizado el concepto correctamente.');
    } catch (e) {
      throw responseError(e, 'No se pudo actualizar el concepto.');
    }
  }

  async remove(id: number): Promise<DataResponse<Concept>> {
    await this.findOne(id);
    try {
      const concept = await this.prisma.concept.delete({ where: { id } });
      return responseData(concept, 'Se ha eliminado el concepto correctamente.');
    } catch (e) {
      throw responseError(e, `No se pudo eliminar el concepto: ${id}.`);
    }
  }

  private async getConcepts(companyId?: number, type?: ConceptType): Promise<Concept[]> {
    return this.prisma.concept.findMany({
      where: {
        ...(companyId !== undefined && { companyId: companyId }),
        ...(type !== undefined && { type }),
      },
    });
  }
}
