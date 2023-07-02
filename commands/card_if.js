const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("card_if")
        .setDescription("計算出兩人的牌誰比較大")
        .addNumberOption((option) =>
            option.setName("長_利奧拉").setDescription("輸入利奧拉的牌有多長").setRequired(true),
        )
        .addNumberOption((option) =>
            option.setName("寬_利奧拉").setDescription("輸入利奧拉的牌有多寬").setRequired(true),
        )
        .addNumberOption((option) =>
            option.setName("長_史考特").setDescription("輸入史考特的牌有多長").setRequired(true),
        )
        .addNumberOption((option) =>
            option.setName("寬_史考特").setDescription("輸入史考特的牌有多寬").setRequired(true),
        ),
    async execute(client, interaction) {
        let a = interaction.options.getNumber("長_利奧拉"); // 已經幫你們宣告好變數了，這裡不需要改
        let b = interaction.options.getNumber("寬_利奧拉"); // 已經幫你們宣告好變數了，這裡不需要改
        let c = interaction.options.getNumber("長_史考特"); // 已經幫你們宣告好變數了，這裡不需要改
        let d = interaction.options.getNumber("寬_史考特"); // 已經幫你們宣告好變數了，這裡不需要改
        let compare = a * b - c * d;
        if (compare == 0) {
            interaction.reply(`兩人平手`);
        } else if (compare > 0) {
            interaction.reply(`利奧拉獲勝`);
        } else {
            interaction, reply(`史考特獲勝`);
        }
    },
};
