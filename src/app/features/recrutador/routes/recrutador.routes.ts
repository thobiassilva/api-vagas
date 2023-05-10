import { Router } from 'express';
import { RecrutadorController } from '../controllers/recrutador.controller';
import { checkLoginValidator } from '../../login/validators/check-login.validator';
import { checkLoginRecrutadorValidator } from '../../../shared/validators/check-login-recrutador';
import { CreateRecrutadorValidator } from '../validators/check-fields-create-recrutador.validator';

export const recrutadorRoutes = () => {
  const router = Router();

  router.get(
    '/',
    [checkLoginValidator, checkLoginRecrutadorValidator],
    new RecrutadorController().list
  );
  router.post(
    '/',
    CreateRecrutadorValidator.validate,
    new RecrutadorController().create
  );

  return router;
};
