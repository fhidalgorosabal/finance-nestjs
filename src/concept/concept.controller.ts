import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Patch, 
  Delete, 
  ParseIntPipe, 
  UseGuards,
  HttpCode, 
} from '@nestjs/common';
import { ConceptService } from './concept.service';
import { CreateConceptDto } from './dto/create-concept.dto';
import { UpdateConceptDto } from './dto/update-concept.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ListConceptsDto } from './dto/list-concepts.dto';

@Controller('concept')
export class ConceptController {
  constructor(private readonly conceptService: ConceptService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createConceptDto: CreateConceptDto) {
    return this.conceptService.create(createConceptDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.conceptService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post('list')
  @HttpCode(200)
  list(@Body() listConceptsDto: ListConceptsDto) {    
    return this.conceptService.list(listConceptsDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.conceptService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateConceptDto: UpdateConceptDto,
  ) {
    return this.conceptService.update(id, updateConceptDto);
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.conceptService.remove(id);
  }
}