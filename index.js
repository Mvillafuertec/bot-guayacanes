const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'] // ESTO ES VITAL PARA LA NUBE
    }
});

client.on('qr', (qr) => {
    console.log('Escanea el QR si es necesario:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('¡Bot activo y listo para dar bienvenidas! 🤖');
});

// --- SECCIÓN DE BIENVENIDA ---
client.on('group_join', async (notification) => {
    const chat = await notification.getChat();
    const contact = await client.getContactById(notification.recipientIds[0]);
    
    // Aquí personalizas tu mensaje. 
    // La parte de @${contact.id.user} es la que hace la mención (tag).
    const mensajeBienvenida = `¡Bienvenido al grupo *@${contact.id.user}* ! Se le pide leer y respetar las reglas (están detalladas en la descripción del grupo) ya que existen temas que están vetados por completo. Cualquier anomalía o consulta, puede hacerlo por interno con los administradores. 👋✨`;

    await chat.sendMessage(mensajeBienvenida, {
        mentions: [contact.id._serialized] // Esto hace que el número aparezca azul y le llegue la notificación al usuario
    });
});
// -----------------------------

client.on('message', async message => {
    if (message.body.toLowerCase() === '!hola') {
        message.reply('¡Hola! Sigo aquí funcionando correctamente.');
    }
});

client.initialize();