// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';

const functions = require('firebase-functions');
const { WebhookClient } = require('dialogflow-fulfillment');
const { Card, Suggestion } = require('dialogflow-fulfillment');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const ciudades = ['Bogotá', 'Ciudad de México'];
  const tematicas = ['Inteligencia Artificial', 'React', 'Firebase'];
  const proxEvento = {
    dia: '20 de Febrero',
    hora: '6 pm',
    tema: 'Web Scraping'
  };
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

  function obtenerCiudad(agent) {
    if (ciudades.includes(agent.parameters.ciudad)) {
      agent.add(`Genial, te puedo ayudar a encontrar charlas o talleres en tu ciudad o eventos en línea. 
					¿Por cuál te gustaría empezar?`);
      agent.add(new Suggestion('Pláticas'));
      agent.add(new Suggestion('Talleres'));
      agent.add(new Suggestion('Lives'));
    } else {
      agent.add(`Oh! aun no hay eventos en tu ciudad, pero el próximo Platzi Live es el día ${proxEvento.dia} 
				a la ${proxEvento.hora} sobre ${proxEvento.tema}`);
    }
  }

  function registroTaller(agent) {
    agent.add(`OK, solo falta un detalle: debes registrarte en la plataforma Meetup. ¿Te gustaría explorar
				algo más?. Solo dí: Quiero información de otra plática o taller o evento en línea`);
    agent.add(new Card({
      title: 'Registro en Meetup',
      imageUrl: 'https://secure.meetupstatic.com/s/img/786824251364989575000/logo/swarm/m_swarm_630x630.png',
      text: 'Registrate en Meetup :)',
      buttonText: 'Registrarme',
      buttonUrl: 'https://secure.meetup.com/es/register/'
    }));
  }

  function detalleTaller(agent) {
    agent.add(`El sabado 26 de octubre, tenemos un taller sobre React Js en Ruta N, a las 7:00 pm. ¿Te gustaría asistir?`);
  }

  function seleccionTematica(agent) {
    agent.add(`Super a mi también me encantan los retos. Estos son los temas que se van a cubrir proximamente en
				tu ciudad ${tematicas.join(', ')}. ¿Cuál temática te gustaría?`);
    agent.add(new Suggestion(tematicas[0]));
    agent.add(new Suggestion(tematicas[1]));
    agent.add(new Suggestion(tematicas[2]));
  }

  function detallePlatziLive(agent) {
    agent.add(`el próximo Platzi Live es el día ${proxEvento.dia} 
				a la ${proxEvento.hora} sobre ${proxEvento.tema}`);
  }
  let intentMap = new Map();
  intentMap.set('Obtener ciudad', obtenerCiudad);
  intentMap.set('Live', detallePlatziLive);
  intentMap.set('Taller', seleccionTematica);
  intentMap.set('Seleccion taller', detalleTaller);
  intentMap.set('Seleccion taller - yes', registroTaller);
  agent.handleRequest(intentMap);
});
