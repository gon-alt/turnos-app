
import { MercadoPagoConfig, Preference } from 'mercadopago';

const app = express();

const client = new MercadoPagoConfig({
  accessToken: 'APP_USR-483527589220585-050100-4adeaf9eefda7d01b2dcc2069cb86151-215045549', // reemplazá con tu token real
});


app.use(express.json());

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
      auto_return: "approved",
    };

    const preference = await new Preference(client).create({ body });

    res.status(200).json({ init_point: preference.init_point });
  } catch (err) {
    console.error('Error al crear la preferencia:', err);
    res.status(500).json({ error: 'Error al generar link de pago' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
