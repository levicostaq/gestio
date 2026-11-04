import { Router } from 'express';
import * as controller from '../controllers/auth.controller.js';
import { autenticar } from '../middlewares/auth.js';

const router = Router();

router.post('/login', controller.login);
router.post('/registrar', controller.registrar);
router.get('/eu', autenticar, controller.eu);

export default router;
