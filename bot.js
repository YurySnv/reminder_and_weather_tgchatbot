const { Telegraf } = require('telegraf')
const { message } = require('telegraf/filters')

const axios = require('axios')

const cron = require('node-cron')
/*
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on(message('sticker'), (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
*/

const bot = new Telegraf('6686627999:AAGu15K0_io1mX-Wh3sLl_sp_PcPsRYvnZo')
bot.start((ctx) => {
    ctx.reply('Добро пожаловать в бота buoy!');
    ctx.reply('Я могу уведомлять вас о состоянии буя и предоставлять информацию о погоде на основе данных о геолокации.')
    ctx.reply(`
    Состояние буя:
    Местоположение: Широта 60°45.445'N, Долгота 33°39.846'E, река Свирь, участок 1093 - 1094 км
    Буй: №153
    Угол наклона: 45 градусов
    Информация об ударе: Да
    Стоимость одного фонаря: 300 000 руб.
    Частота сообщений: Два раза в день в 9:00 и 18:00
    `)
})

/*
// Функция для отправки сообщения о состоянии буя
function sendBuoyStatus(ctx) {
    const buoyInfo = `
    Местоположение: Широта 60°45.445'N, Долгота 33°39.846'E, Река Свирь, участок 1093 - 1094 км
    Буй: №153
    Состояние: Работает
    Информация об ударе: Да
    Угол наклона: 45 градусов
    
    `
    ctx.telegram.sendMessage(-4067483219, buoyInfo);
}
*/

// Регулярная отправка сообщений о состоянии буя
cron.schedule('0 9,18 * * *', () => {
    // Здесь указаны часы (9 и 18) и минута (0), когда нужно отправлять сообщение (два раза в день)
    bot.telegram.sendMessage(-4067483219,
    `
    Отправка информации о состоянии буя:
    Местоположение: Широта 60°45.445'N, Долгота 33°39.846'E, Река Свирь, участок 1093 - 1094 км
    Буй: №153
    Состояние: Работает
    Информация об ударе: Да
    Угол наклона: 45 градусов
    `)

    //sendBuoyStatus(bot)
})

// Обработка геолокации
bot.on('message', async (ctx) => {
    if (ctx.message.location) {
        console.log(ctx.message.location)
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${ctx.message.location.latitude}&lon=${ctx.message.location.longitude}&units=metric&appid=0842a53a80fed56468b814aa90dd54b1`
        const response = await axios.get(url)
        console.log(response)
        ctx.reply(`${response.data.name}: ${response.data.main.temp}°C`)
    }
})


// Запуск бота
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))