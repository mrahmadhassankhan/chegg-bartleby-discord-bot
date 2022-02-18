/*I Write this simple script in Java Script this will work both for chegg and for bartleby for chegg just make few changes and this will work.
This code is only for educational purposes only it don't promote any illegal activity and all the credit goes to @ahmadhassankhan that's me so 
don't copy paste on another website without persmission,Legal action will be taken if someone do so.*/

const Discord = require('discord.js');
const puppeteer = require('puppeteer-extra');
const fs = require('fs');
const https = require('https');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')

const client = new Discord.Client();

global.username = 'LOGIN GOES HERE'
global.password = 'PASS GOES HERE'
global.discordlogin = 'BOT TOKEN GOES HERE'

var queue = false;

puppeteer.use(StealthPlugin())

const download = (url, destination) => new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination);

    https.get(url, response => {
        response.pipe(file);

        file.on('finish', () => {
            file.close(resolve(true));
        });
    }).on('error', error => {
        fs.unlink(destination);

        reject(error.message);
    });
});

client.on('ready', () => {
    login_bartleby()
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {

    if (message.content.startsWith(`-b`)) {

        var s = message.content.replace('-b', '')
		
        if (!s.includes('https://www.bartleby.com/questions-and-answers/')) {
            const errorEmbed = new Discord.MessageEmbed()
                .setColor('#C91019')
                .setTitle('Error')
                .setDescription('No! Bartleby links only!')
                .setThumbnail('https://images-ext-1.discordapp.net/external/9yiAQ7ZAI3Rw8ai2p1uGMsaBIQ1roOA4K-ZrGbd0P_8/https/cdn1.iconfinder.com/data/icons/web-essentials-circle-style/48/delete-512.png?width=461&height=461')
                .setTimestamp()
                .setFooter('Powered by Ahmad Hassan Khan(Github ->@mrahmadhassankhan)');
            message.channel.send(message.author.toString(), {
                embed: errorEmbed
            });
            return;
        }

        if (queue) {
            const errorEmbed = new Discord.MessageEmbed()
                .setColor('#C91019')
                .setTitle('Error')
                .setDescription('Wait your turn!')
                .setThumbnail('https://images-ext-1.discordapp.net/external/9yiAQ7ZAI3Rw8ai2p1uGMsaBIQ1roOA4K-ZrGbd0P_8/https/cdn1.iconfinder.com/data/icons/web-essentials-circle-style/48/delete-512.png?width=461&height=461')
                .setTimestamp()
                .setFooter('Powered by Ahmad Hassan Khan(Github ->@mrahmadhassankhan)');
            message.channel.send(message.author.toString(), {
                embed: errorEmbed
            });
            return;
        }
		
        process_answer(s)
		
        async function process_answer(url) {
            queue = true;
            const processEmbed = new Discord.MessageEmbed()
                .setColor('#F85B00')
                .setTitle('Processing')
                .setDescription('Your request is being processed!')
                .setTimestamp()
                .setFooter('Powered by Ahmad Hassan Khan(Github ->@mrahmadhassankhan)');
            var msg = message.channel.send(message.author.toString(), {
                embed: processEmbed
            });
            await page[0].goto(url, {
                waitUntil: 'networkidle2'
            });/*
      
            await page[0].setViewport({ width: 1024, height: 800 });
            global.screenshot = await page[0].screenshot({
            path: 'test.png',
                fullPage: true
            });
            message.author.send("Page ScreenShot:", {
                files: ['./test.png']
            });
            
           const images = await page[0].evaluate(() => Array.from(document.images, e => e.src));
            let result;
            var question = false;
           for (let i = 0; i < images.length; i++) {
                if (images[i].includes('s3.amazonaws.com')) {
                    result = await download(images[i], `image-${i}.png`);

                    if (result === true) {
                        if (!question) {
                            message.author.send("INDIVIDUAL IMAGES:", {
                                files: [images[i]]
                            })
                            question = true;
                        } else {
                            message.author.send({
                                files: [images[i]]
                            })
                        }
                        console.log('Success:', images[i], 'has been downloaded successfully.');
                    } else {
                        console.log('Error:', images[i], 'was not downloaded.');
                        console.error(result);
                    }
                }
            }*/
    
            

            const element = await page[0].$('#qna-answer-container-id > div.styles__MyQuestionContainer-sc-1xvt7re-1.ehiCjA');
            element_property = await element.getProperty('innerHTML');
            const inner_html = await element_property.jsonValue();

            const element2 = await page[0].$('#qna-answer-container-id > div.styles__MyAnswerContainer-sc-1xvt7re-11.iYfoFb');
            element_property2 = await element2.getProperty('innerHTML');
            const inner_html2 = await element_property2.jsonValue();

            await fs.writeFile("answer.html", inner_html.concat('\n', inner_html2), function(err) {
                if (err) return console.log(err);

            });
            message.author.send("HTML ANSWER:", {
                files: ['./answer.html']
            })
 
            const successEmbed = new Discord.MessageEmbed()
                .setColor('#00F800')
                .setTitle('Success')
                .setDescription('Your request has been processed, check your DMs!')
                .setThumbnail('https://images-ext-2.discordapp.net/external/OVUlwF6n8j6wANCkwDzG_Rb2ivqCd9bRF10DC2Z8lS0/https/s5.gifyu.com/images/ezgif.com-optimized7ce94c5d4a783cb.gif')
                .setTimestamp()
                .setFooter('Powered by Ahmad Hassan Khan(Github ->@mrahmadhassankhan)');
            message.channel.send(message.author.toString(), {
                embed: successEmbed
            });

            queue = false;
        }
    }

})
client.login(discordlogin);
async function login_bartleby() {

    global.browser = await puppeteer.launch({
        headless: false,
        slowMo: 10,
        userDataDir: 'C:\\userData',
    });

    global.page = await browser.pages();
    var userAgent = require('user-agents');

    await page[0].setUserAgent(userAgent.toString());
    console.log("Going to Bartley");
    await page[0].goto("https://www.bartleby.com/login&redirect=https%3A%2F%2Fwww.bartley.com%2F", {
        waitUntil: 'networkidle2'
    });

}
