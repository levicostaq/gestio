import { Router } from 'express';
import * as controller from '../controllers/vendas.controller.js';

const router = Router();

router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);
router.post('/', controller.criar);
router.delete('/:id', controller.remover);
// Sem PUT: venda não se edita. Se errou, cancela e registra de novo.

export default router;
