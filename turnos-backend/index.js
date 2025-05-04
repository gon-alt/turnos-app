import express from 'express';
import cors from 'cors';
import { MercadoPagoConfig, Preference } from 'mercadopago';

// Inicializar Express
const app = express();
const PORT = process.env.PORT || 3001;

// Configurar Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: 'APP_USR-483527589220585-050100-4adeaf9eefda7d01b2dcc2069cb86151-215045549', // Reemplazá con tu token
});

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba para generar link de pago
app.post('/api/reservar', async (req, res) => {
  try {
    const { description, price } = req.body;

    const body = {
      items: [
        {
          title: description || 'Reserva de turno',
          quantity: 1,
          unit_price: Number(price) || 1000,
          currency_id: 'ARS',
        },
      ],
      back_urls: {
        success: "https://www.tusitio.com/success",
        failure: "https://www.tusitio.com/failure",
        pending: "https://www.tusitio.com/pending",
      },
      auto_return: "approved"
    };

    const preference = await new Preference(client).create({ body });
    res.status(200).json({ init_point: preference.init_point });
  } catch (err) {
    console.error('Error al crear la preferencia:', err);
    res.status(500).json({ error: 'Error al generar link de pago' });
  }
});


import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();





app.use(cors()); // Habilita CORS para todas las rutas
const port = process.env.PORT || 3001;

// Configuración de Google Calendar API
const calendar = google.calendar("v3");

const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
});

// Endpoint para obtener eventos del calendario
app.get("/api/turnos", async (req, res) => {
  try {
    const authClient = await auth.getClient();
    const calendarId = process.env.GOOGLE_CALENDAR_ID; // Asegúrate que esté en el .env

    const response = await calendar.events.list({
      auth: authClient,
      calendarId: calendarId, // Aquí se pasa el calendarId correctamente
      timeMin: (new Date()).toISOString(),
      maxResults: 10, // Limita el número de resultados
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = response.data.items;
    res.json(events);
  } catch (error) {
    console.error("Error al obtener eventos:", error);
    res.status(500).send("Error al obtener eventos");
  }
});



// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


