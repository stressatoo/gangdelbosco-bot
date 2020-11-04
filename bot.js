const Discord = require("discord.js"); // We Call The Packages.
// const PREFIX = "<"; // You can change this Prefix to whatever you want.
const PREFIX = process.env.PREFIX;

var bot = new Discord.Client();

// Events.
bot.on("ready", function() {
    bot.user.setGame(`Attendo ordini da mio padre Stress.`);
    console.log(`${bot.user.username} si è avviato, stato messo!`);
});

bot.on("message", function(message) {

    if (message.author.bot) return;

    if (!message.guild) return;

    if (!message.content.startsWith(PREFIX)) return;

    var args = message.content.substring(PREFIX.length).split(" ");
    var command = args[0].toLowerCase();

// Commands.
    if (command == "help") {
        var embedhelpmember = new Discord.RichEmbed()
            .setAuthor("💬 Lista dei comandi.")
            .addField(" - avatar", "Mostra il tuo avatar.")
            .addField(" - ping", "Risponde 'pong'.")
            .setColor(0x00FFEE)
            .setFooter("Ⓒ 2020 Gang del Bosco.", bot.user.displayAvatarURL);
        var embedhelpadmin = new Discord.RichEmbed()
            .setAuthor("💬 Comandi per moderatori.")
            .addField(" - prune", "Cancella fino a `99` messaggi.")
            .addField(" - kick", "Fa il panettone a qualcuno.")
            .setColor(0x00FFEE)
            .setFooter("Ⓒ 2020 Gang del Bosco.", bot.user.displayAvatarURL);
            message.channel.send(embedhelpmember)
        if(message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send(embedhelpadmin);
    };

    if (command == "avatar") {
        let member = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        message.channel.send({
               embed: {
                  title: `Foto profilo di ${member.displayAvatarURL}.`,
                  image: {
                      url: member.AvatarURL
                  },
                  color: 0x00FFEE
               }
        })
    };

    if (command == "ping") {
        message.channel.send("**:ping_pong: pong lol**");
    };

    if(command === "prune") {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.reply("**🔒 Scusa, non puoi farlo lmao.**");
        var messagesToDelete = args[1];
        if (!args[1]) return message.channel.send("❌ Includi la quantità di messaggi che vuoi **cancellare**!");
        if (args[1] > 99) return message.channel.send("❌ Sono inutile quindi non posso **cancellare** più di `99` messaggi, arrangiati.");
        message.channel.fetchMessages({limit: messagesToDelete})
        .then(messages => message.channel.bulkDelete(messages.size + 1))
        .catch(error => message.channel.send(`❌ Scusa fra ${message.author}, non sono riuscito ad **eliminare** i messaggi per questo motivo: *${error}*.`));
    };

    if(command == "kick") {
        message.delete()
        let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!kUser) return message.channel.send("❌ Per favore bro,  **@menziona** la persona a cui vuoi fare il panettone.!");
        let kReason = args.join(" ").slice(0);
        if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("**🔒 Scusa fra, ma non hai i fottuti permessi.**");
        if(kUser.hasPermission("KICK_MEMBERS")) return message.channel.send("❌ Non posso **kickare** sto qua, ha i permessi più alti dei miei, quindi per favore ARRANGIATI.");

        let kickEmbed = new Discord.RichEmbed()
        .setDescription("**👢 Haha panettone go brrr**")
        .setColor(0xFF0000)
        .addField("Utente", `${kUser}`)
        .addField("Moderatore", `<@${message.author.id}>`)
        .addField("Motivo", `**\`\`\`${kReason}\`\`\`**`);

        let adminlog = message.guild.channels.find(`name`, "mod-logs");
        if(!adminlog) return message.channel.send("❌ Scusa fra, ma mi serve il canale dei logs con il nome **#mod-logs**.");
        message.guild.member(kUser).kick(kReason);
        adminlog.send(kickEmbed);
    };

});

// Bot Login.
// bot.login('YourAwesomeBotToken');
bot.login(process.env.BOT_TOKEN);
