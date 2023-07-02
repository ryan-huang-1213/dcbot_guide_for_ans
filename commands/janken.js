const {
    SlashCommandBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
} = require("discord.js");
const fs = require("fs");

function getEmbed(win, id, total) {
    let ans;
    if (win == 1) {
        ans = new EmbedBuilder()
            .setTitle("猜拳")
            .setDescription(`恭喜玩家 <@${id}> 擊敗電腦，現有 ${total} 元`)
            .setColor("Blue");
    } else if (win == -1) {
        ans = new EmbedBuilder()
            .setTitle("猜拳")
            .setDescription(`玩家 <@${id}> 不幸被電腦擊敗，現有 ${total} 元`)
            .setColor("Red");
    } else {
        ans = new EmbedBuilder()
            .setTitle("猜拳")
            .setDescription(`兩人平手 <@${id}> 現有 ${total} 元，至少錢沒有變少`)
            .setColor("Purple");
    }
    return ans;
}

module.exports = {
    data: new SlashCommandBuilder().setName("janken").setDescription("跟電腦進行猜拳"),
    async execute(client, interaction) {
        const data = fs.readFileSync("players.json");
        let testdata = JSON.parse(data);
        const paper = new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setEmoji("🖐️")
            .setCustomId("0");
        const scissors = new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setEmoji("✌️")
            .setCustomId("1");
        const stone = new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setEmoji("✊")
            .setCustomId("2");
        const row = new ActionRowBuilder().addComponents(paper, scissors, stone);

        let embed = new EmbedBuilder().setTitle("猜拳").setDescription("test").setColor("Purple");
        await interaction.reply({ embeds: [embed], components: [row] });

        const collector = interaction.channel.createMessageComponentCollector({ time: 15000 });

        collector.on("collect", async (collected) => {
            if (collected.user.id == interaction.user.id) {
                let botChoice = Math.floor(Math.random() * 3);
                let playerChoice = collected.customId;

                let win = 0;
                if (botChoice == (playerChoice - 1) % 3) {
                    win = 1;
                    embed.setDescription("贏了");
                } else if (playerChoice == (botChoice - 1) % 3) {
                    win = -1;
                    embed.setDescription("輸了");
                } else if (playerChoice == botChoice) {
                    win == 0;
                    embed.setDescription("平手");
                }

                let earnings = win * 30;

                let total = 0;
                let found = false;
                for (let i = 0; i < testdata.length; i++) {
                    if (testdata[i].id == collected.user.id) {
                        //console.log("found");
                        found = true;
                        testdata[i].money = testdata[i].money + earnings;
                        total = testdata[i].money;
                        break;
                    }
                }

                if (found == false) {
                    //console.log(found);
                    testdata.money += 500;
                    testdata.id = collected.id;
                    total = testdata.money;
                    testdata.push({ id: collected.user.id, money: 500 + earnings });
                }

                let ans = getEmbed(win, collected.user.id, total);
                interaction.followUp({ embeds: [ans] });
                const jsonDataOut = JSON.stringify(testdata);
                fs.writeFileSync("players.json", jsonDataOut);
                collector.stop();
            }
        });
    },
};
