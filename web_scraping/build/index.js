"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var csv_parser_1 = __importDefault(require("csv-parser"));
var ign_reviews_1 = require("./ign_reviews");
var getGamePlatformForMetacritic = function (game_platform) {
    var platform = game_platform.toLowerCase().replace(/ /g, "-");
    return (platform[0] === "-") ? platform.slice(1) : platform;
};
var getGameUrlFromGameName = function (game_name) {
    return game_name.toLowerCase()
        .replace(/\//g, "").replace(/  /g, " ")
        .replace(/\'/g, "").replace(/  /g, " ")
        .replace(/\:/g, "").replace(/  /g, " ")
        .replace(/\&/g, "").replace(/  /g, " ")
        .replace(/\./g, "").replace(/  /g, " ")
        .replace(/ /g, "-");
};
fs_1.default.createReadStream('../metacritic_all_games_1995_2021.csv')
    .pipe((0, csv_parser_1.default)())
    .on('data', function (data) {
    return;
    var game_name = getGameUrlFromGameName(data["name"]);
    var game_platform = getGamePlatformForMetacritic(data["platform"]);
    (0, ign_reviews_1.getIGNGameReviewThroughMetacritic)("".concat(ign_reviews_1.METACRITIC_ROOT_URL, "/game/").concat(game_platform, "/").concat(game_name, "/critic-reviews"), game_name, game_platform)
        .then(function (review_file_path) { return console.log("Finished ".concat(review_file_path)); })
        .catch(function (err) {
        console.log(err);
        (0, ign_reviews_1.getIGNGameReviewThroughIGN)("".concat(ign_reviews_1.IGN_ROOT_URL, "/games/").concat(game_name), game_name, game_platform)
            .then(function (review_file_path) { return console.log("Finished ".concat(review_file_path)); })
            .catch(function (ignErr) { return console.log(ignErr); });
    });
});
