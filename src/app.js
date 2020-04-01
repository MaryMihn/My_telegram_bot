require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');
const request = require("request");

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {polling: true});

bot.onText(/\/hi/, (msg, match) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "валюти ", {
        reply_markup:{
            inline_keyboard:[[
                {
                    text: "EUR",
                    callback_data:"EUR"
                },
                {
                    text: "USD",
                    callback_data:"USD"
                }
            ]]
        }
    });
});

bot.on("callback_query", query =>{
    const id = query.message.chat.id;
    
    request("https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5", function (error, response, body) {
        const data = JSON.parse(body);
        const result =data.filter(item => item.ccy === query.data)[0];
        let md = `*${result.ccy} => ${result.base_ccy}*
        buy: _${result.buy}_
        sale: _${result.sale}_`;
        bot.sendMessage(id, md, {parse_mode:`Markdown`});
    })
})