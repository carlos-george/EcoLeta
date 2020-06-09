import express from 'express';
import multer from 'multer';
import { celebrate, Joi} from 'celebrate';

import multerConfig from './config/multer';
import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';



const routes = express.Router();
const uploade = multer(multerConfig);
const pointsController = new PointsController();
const itemController = new ItemsController();


routes.get('/', (request, response) => {
    return response.json({message: 'Hello World'});
});

routes.get('/items', itemController.index);

routes.get('/points/:id', pointsController.show);

routes.get('/points', pointsController.index);

routes.get('/list-points', pointsController.list);

routes.post('/points', 
           multer().any(), 
            celebrate({
                body: Joi.object().keys({
                    name: Joi.string().required(),
                    email: Joi.string().required().email(),
                    whatsapp: Joi.string().required(),
                    latitude: Joi.number().required(),
                    longitude: Joi.number().required(),
                    city: Joi.string().required(),
                    uf: Joi.string().required().max(2),
                    items: Joi.string().required(),
                })
            },
            {
                abortEarly: false
            }),
            uploade.single('image'),
            pointsController.create
            );

routes.delete('/points/:id', pointsController.delete);


export default routes;

// const users = [
//     'Carlos', 'Renata', 'Giovanna', 'Harley', 'Terezinha'
// ]

// routes.get('/users', (request, response) => {
    
//     const search = String(request.query.search);

//     const filtersUsers = search ? users.filter(user => user.includes(search)) : users;

//    return response.json(filtersUsers);
// });

// routes.get('/users/:id', (request, response) => {
//     const id = Number(request.params.id);

//     const user = users[id];

//     return response.json(user);
// });

// routes.post('/users', (request, response) => {

//     const body = request.body;

//     const t = {
//         nome: body.nome,
//         sobreNome: body.sobreNome,
//         email: body.email,
//         tel: body.tel
//     }

//     return response.json(t);
// });