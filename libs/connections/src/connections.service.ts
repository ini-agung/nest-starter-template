import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';

export async function DBRead (table: string, properties: string[], parameter:string, orderBy: string){
    const selectClause = properties.map(property => `\`${property}\``).join(', ');
    const query = `SELECT ${selectClause} FROM ${table} ${parameter} ORDER BY ${orderBy};`;
    return this.ConnectionsService.execute();
}

@Injectable()
export class ConnectionsService {
    constructor(private readonly connection:Connection){}
    execute(){
        return true;
    }
}
