import { Router } from 'express';
import clientesRoutes from './clientes.routes.js';

const router = Router();

router.use('/clientes', clientesRoutes);
// router.use('/produtos', produtosRoutes);  // próxima tarefa: seguir o padrão de clientes
// router.use('/vendas', vendasRoutes);

export default router;
