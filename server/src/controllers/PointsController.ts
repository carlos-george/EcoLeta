import { Request, Response} from 'express'
import knex from '../database/connection';

class PointsController {

    async index(request: Request, response: Response) {
        const { city, uf, items } = request.query;

        const parsedItems = String(items)
                .split(',')
                .map(item => Number(item.trim()));

        const points = await knex('points')
                    .join('points_items', 'points.id_point', '=', 'points_items.id_point')
                    .whereIn('points_items.id_item', parsedItems)
                    .where('points.city', String(city))
                    .where('points.uf', String(uf))
                    .distinct()
                    .select('points.*');

        const serializedPoints = points.map(point => {
            return {
                ...point, 
                image: `http://192.168.0.17:3333/uploads/${point.image}`
                }
        });            

        return response.json(serializedPoints);
    }

    async list(request: Request, response: Response) {

        const { city, uf, items } = request.query;

        const parsedItems = String(items)
                .split(',')
                .map(item => Number(item.trim()));

        const points = await knex('points')
        .join('points_items', 'points.id_point', '=', 'points_items.id_point')
        .whereIn('points_items.id_item', parsedItems)
        .where('points.city', String(city))
        .where('points.uf', String(uf))
        .distinct()
        .select('points.*')
        .orderBy('points.name');

        const serializedPoints = points.map(point => {
            return {
                ...point, 
                image: `http://192.168.0.17:3333/uploads/${point.image}`
                }
        });      

        Promise.all(serializedPoints.map(async point => {
            return await knex('items')
                        .join('points_items', 'items.id_item', '=', 'points_items.id_item')
                        .where('points_items.id_point', point.id_point)
                        .select('items.titulo').then(res => ({...point, items: res}))
        })).then(res => response.json(res));

    }

    async show(request: Request, response: Response) {

        const { id } = request.params;

        const point = await knex('points').where('id_point', id).first();

        if(!point) {
            return response.status(400).json({ message: 'Point not found.'})
        }

        const items = await knex('items')
                .join('points_items', 'items.id_item', '=', 'points_items.id_item')
                .where('points_items.id_point', id)
                .select('items.titulo', 'items.id_item');
        
        return response.json({
                ...point, 
                image: `http://192.168.0.17:3333/uploads/${point.image}`, 
                items
            });
    }
    
    async delete(request: Request, response: Response) {
        
        const { id } = request.params;

        const trx = await knex.transaction();

        const point = await trx('points').where('id_point', id).first();

        if(!point) {
            return response.status(400).json({ message: 'Point not found.'})
        }

        await trx('points_items').where('id_point', id).del();

        await trx('points').where('id_point', id).del();

        await trx.commit();

        return response.json({
            message: 'Ponto de coleta excluído com sucesso!'
        });
    }

    async create(request: Request, response: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body
    
        const trx = await knex.transaction();

        const point = {
            image: request.file.filename,
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        };

        const insertedIds = await trx('points').insert(point);
    
        const id = insertedIds[0];
    
        const pointItems = items
            .split(',')
            .map((item: string) => Number(item.trim()))
            .map((id_item: number) => {
                return {
                    id_item,
                    id_point: id
                }
            });
    
        await trx('points_items').insert(pointItems);

        await trx.commit();

        return response.json({
            message: 'Ponto de coleta cadastrado com sucesso!'
        });
    }

    async update(request: Request, response: Response) {

        const { id } = request.params;

        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body
    
        const trx = await knex.transaction();

        const point = {
            image: request.file.filename,
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        };

        await trx('points')
                .where('points.id_point', id)
                .update({
                            image: point.image,
                            name: point.name,
                            email: point.email,
                            whatsapp: point.whatsapp,
                            latitude: point.latitude,
                            longitude: point.longitude,
                            city: point.city,
                            uf: point.uf
                        });
    
        const pointItems = items
            .split(',')
            .map((item: string) => Number(item.trim()))
            .map((id_item: number) => {
                return {
                    id_item,
                    id_point: id
                }
            });
            
        await trx('points_items').where('points_items.id_point', id).del();    

        await trx('points_items').insert(pointItems);

        await trx.commit();

        return response.json({
            message: 'Ponto de coleta atualizado com sucesso!'
        });
    }
};

export default PointsController;
