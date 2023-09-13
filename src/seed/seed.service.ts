// import { HttpService } from '@nestjs/axios';
import { Injectable, ParseIntPipe } from '@nestjs/common';
// import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  // private readonly axios: AxiosInstance = axios;

  constructor(
    private readonly pokemonService: PokemonService,
    private readonly http: AxiosAdapter
    ) {}
 
  async executeSeed() {

    await this.pokemonService.removeAll();

    // const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');
    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');

  


    // 1ERA FORMA DE INSERCION

    // data.results.forEach(async({name, url}) => {
    //   const segments = url.split('/');
    //   const no = +segments[segments.length - 2];
    //   console.log({name,no});

    //   await this.pokemonService.create({name, no})
      
    // })

    // 2DA FORMA DE INSERCION

    // const insertPromisesArray = [];
    
    // data.results.forEach(({name, url}) => {
    //   const segments = url.split('/');
    //   const no = +segments[segments.length - 2];
    //   console.log({name,no});

    //   insertPromisesArray.push(
    //     this.pokemonService.create({name, no})
    //   );
      
    // });

    // await Promise.all(insertPromisesArray);

    
    // 3ERA FORMA - RECOMENDADA

    const pokemonToInsert: {name: string, no: number}[] = [];

    data.results.forEach(({name, url}) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];

      pokemonToInsert.push({name,no})
      
    });

    await this.pokemonService.insertCluster(pokemonToInsert);

    return "Seed ejecutado";
  }

}
