import { Injectable } from '@nestjs/common';
import { httpAdapter } from "../interfaces/http-adapter.interface";

import axios, { AxiosInstance } from 'axios';

@Injectable()
export class AxiosAdapter implements httpAdapter {

    private axios: AxiosInstance = axios;

    async get<T>(url: string): Promise<T> {
        try {
            const { data } = await this.axios.get<T>(url);
            return data;
        } catch (error) {
            throw new Error('Ocurrio un error, revisar los logs');
        }
    }

}