const express = require('express');
const router = express.Router();
const { getClimatologia,getClimatologiaFecha,crearClimatologia,getDemanda,getDemandaFecha,crearDemanda,getEventos,getEventosFecha,crearEventos,getHidroelectricas,getHidroelectricasFecha,crearHidroelectricas,getHidroelectricasNombre,getCentrales } = require('../controllers/controlador');

router.get('/getClimatologia', getClimatologia);
router.get('/getClimatologiaFecha', getClimatologiaFecha);
router.post('/crearClimatologia', crearClimatologia);

router.get('/getEventos', getEventos);
router.get('/getEventosFecha', getEventosFecha);
router.post('/crearEventos', crearEventos);

router.get('/getDemanda', getDemanda);
router.get('/getDemandaFecha', getDemandaFecha);
router.post('/crearDemanda', crearDemanda);

router.get('/getHidroelectricas', getHidroelectricas);
router.get('/getHidroelectricasFecha', getHidroelectricasFecha);
router.get('/getHidroelectricasNombre', getHidroelectricasNombre);
router.post('/crearHidroelectricas', crearHidroelectricas);

router.get("/getDistancias",getCentrales);

module.exports = router;