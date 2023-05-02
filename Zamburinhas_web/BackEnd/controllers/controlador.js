const axios = require('axios');

const Climatologia = require('../models/climatologia');
const Demanda = require('../models/demanda');
const Eventos = require('../models/eventos');
const Hidroelecitricas = require('../models/hidroelectrica');
const Centrales = require('../models/centrales');


/* CLIMATOLOGIA */
const getClimatologia = async (req, res) => {
  try {
    const climatologia = await Climatologia.find();
    res.json(climatologia);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getClimatologiaFecha = async (req, res) => {
  let { fecha } = req.query;
  try {
    const climatologia = await Climatologia.find({fecha : fecha});
    res.json(climatologia);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const crearClimatologia = async (req, res) => {
  try {
    console.log(req)
    const { fecha, central } = req.body;
    const climatologia = new Climatologia({ fecha, central });
    const savedClimatologia = await climatologia.save();
    res.status(201).json(savedClimatologia);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* DEMANDA */

const getDemanda = async (req, res) => {
  try {
    const demanda = await Demanda.find();
    res.json(demanda);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const crearDemanda = async (req, res) => {
  try {
    console.log(req)
    const { fecha, central } = req.body;
    const demanda = new Demanda({ fecha, central });
    const saveddemanda = await demanda.save();
    res.status(201).json(saveddemanda);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getDemandaFecha = async (req, res) => {
  let { fecha } = req.query;
  try {
    const demanda = await Demanda.find({fecha : fecha});
    res.json(demanda);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



/* EVENTOS */


const getEventos= async (req, res) => {
  try {
    const eventos = await Eventos.find();
    res.json(eventos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const crearEventos = async (req, res) => {
  try {
    console.log(req)
    const { fecha, central } = req.body;
    const eventos = new Eventos({ fecha, central });
    const savedeventos = await eventos.save();
    res.status(201).json(savedeventos);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getEventosFecha = async (req, res) => {
  let { fecha } = req.query;
  try {
    const eventos = await Eventos.find({fecha : fecha});
    res.json(eventos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* HIDROELECTRICAS */



const getHidroelectricas = async (req, res) => {
  try {
    const hidroelectricas = await Hidroelecitricas.find();
    res.json(hidroelectricas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const crearHidroelectricas = async (req, res) => {
  try {
    console.log(req)
    const { fecha,nombre, central } = req.body;
    const hidroelectricas = new Hidroelecitricas({ fecha, nombre, central });
    const savedhidroelectricas = await hidroelectricas.save();
    res.status(201).json(savedhidroelectricas);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getHidroelectricasFecha = async (req, res) => {
  let { fecha } = req.query;
  try {
    const hidroelectricas = await Hidroelecitricas.find({fecha : fecha});
    res.json(hidroelectricas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getHidroelectricasNombre = async (req, res) => {
  let { nombre } = req.query;
  try {
    const hidroelectricas = await Hidroelecitricas.find({nombre : nombre});
    res.json(hidroelectricas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* CENTRALES */

const getCentrales = async (req, res) => {
  try {
    const centrales = await Centrales.find();
    res.json(centrales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCentralesNombre = async (req, res) => {
  let { nombre } = req.query;
  try {
    const centrales = await Centrales.find({nombre : nombre});
    res.json(centrales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const crearCentrales= async (req, res) => {
  try {
    const { nombre, areas } = req.body;
    const centrales = new Hidroelecitricas({ nombre, areas });
    const savedcentrales = await centrales.save();
    res.status(201).json(savedcentrales);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


module.exports = {
  getClimatologia,
  getClimatologiaFecha,
  crearClimatologia,
  getDemanda,
  crearDemanda,
  getDemandaFecha,
  getEventos,
  getEventosFecha,
  crearEventos,
  getHidroelectricas,
  getHidroelectricasFecha,
  crearHidroelectricas,
  getHidroelectricasNombre,
  getCentrales,
  getCentralesNombre,
  crearCentrales
}