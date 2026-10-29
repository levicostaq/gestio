import { Router } from 'express';
import clientesRoutes from './clientes.routes.js';
import produtosRoutes from './produtos.routes.js';

const router = Router();

router.use('/clientes', clientesRoutes);
router.use('/produtos', produtosRoutes);
// router.use('/vendas', vendasRoutes);

export default router;
