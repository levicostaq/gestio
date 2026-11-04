import { Router } from 'express';
import * as controller from '../controllers/painel.controller.js';

const router = Router();

router.get('/', controller.mostrar);

export default router;
