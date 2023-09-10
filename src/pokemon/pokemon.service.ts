import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import * as request from 'supertest';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {

    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleException(error);
    }


  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {

    let pokemon;

    if(!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({no: term});
    }

    // Mongo ID
    if(isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    // Name
    if(!pokemon) {
      pokemon = await this.pokemonModel.findOne({name: term.toLowerCase().trim()});
    }

    if(!pokemon) {
      throw new NotFoundException(`El pokemon con id, nombre o mongoid "${term}" no existe`);
    }

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne(term);

    if(updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    }
    try {
      await pokemon.updateOne(updatePokemonDto, {new: true});
      return {...pokemon.toJSON(), ...updatePokemonDto};
    } catch (error) {
      this.handleException(error);
    }
    

  }

  async remove(id: string) {
    
    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();

    // const result = await this.pokemonModel.findByIdAndDelete(id);

    const { deletedCount } = await this.pokemonModel.deleteOne({_id: id});

    if(deletedCount === 0) {
      throw new BadRequestException(`Pokemon con id ${id} no encontrado`);
    }

    return;

  }

  private handleException(error: any) {

    console.log(error);
      if(error.code === 11000) {
        throw new BadRequestException(`Pokemon ya existe en la BD ${ JSON.stringify(error.keyValue) }`);
      }

      throw new InternalServerErrorException(`No se creo el pokemon - revisar logs del servidor`);

  }

}
