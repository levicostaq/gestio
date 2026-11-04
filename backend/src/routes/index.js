import { Router } from 'express';
import { autenticar, somenteAdmin } from '../middlewares/auth.js';
import authRoutes from './auth.routes.js';
import clientesRoutes from './clientes.routes.js';
import produtosRoutes from './produtos.routes.js';
import vendasRoutes from './vendas.routes.js';
import lancamentosRoutes from './lancamentos.routes.js';
import painelRoutes from './painel.routes.js';
import usuariosRoutes from './usuarios.routes.js';

const router = Router();

// Rotas abertas: login e cadastro de empresa
router.use('/auth', authRoutes);

// Daqui para baixo, todas as rotas exigem login (RNF03)
router.use(autenticar);

router.use('/clientes', clientesRoutes);
router.use('/produtos', produtosRoutes);
router.use('/vendas', vendasRoutes);
router.use('/painel', painelRoutes);

// Só o administrador
router.use('/lancamentos', somenteAdmin, lancamentosRoutes);
router.use('/usuarios', somenteAdmin, usuariosRoutes);

export default router;
