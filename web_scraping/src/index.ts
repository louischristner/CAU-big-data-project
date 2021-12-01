import fs from 'fs';
import csv from 'csv-parser';

import {
    getIGNPageReview,
    getIGNGameReviewThroughIGN,
    getIGNGameReviewThroughMetacritic,
    IGN_ROOT_URL,
    METACRITIC_ROOT_URL
} from './ign_reviews';


const getGamePlatformForMetacritic = (game_platform: string) => {
    const platform = game_platform.toLowerCase().replace(/ /g, "-");
    return (platform[0] === "-") ? platform.slice(1) : platform;
};

const getGameUrlFromGameName = (game_name: string) => {
    return game_name.toLowerCase()
        .replace(/\//g, "").replace(/  /g, " ")
        .replace(/\'/g, "").replace(/  /g, " ")
        .replace(/\:/g, "").replace(/  /g, " ")
        .replace(/\&/g, "").replace(/  /g, " ")
        .replace(/\./g, "").replace(/  /g, " ")
        .replace(/ /g, "-");
};



fs.createReadStream('../metacritic_all_games_1995_2021.csv')
    .pipe(csv())
    .on('data', (data) => {
        const game_name = getGameUrlFromGameName(data["name"]);
        const game_platform = getGamePlatformForMetacritic(data["platform"]);
        getIGNGameReviewThroughMetacritic(`${METACRITIC_ROOT_URL}/game/${game_platform}/${game_name}/critic-reviews`, game_name, game_platform)
            .then(review_file_path => console.log(`Finished ${review_file_path}`))
            .catch(err => {
                console.log(err)
                getIGNGameReviewThroughIGN(`${IGN_ROOT_URL}/games/${game_name}`, game_name, game_platform)
                    .then(review_file_path => console.log(`Finished ${review_file_path}`))
                    .catch(ignErr => console.log(ignErr));
            });
    });