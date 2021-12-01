import fs from 'fs';
import axios from 'axios';
import {
    HTMLElement,
    Node,
    parse
} from 'node-html-parser';

export const IGN_ROOT_URL = 'https://www.ign.com';
export const METACRITIC_ROOT_URL = 'https://www.metacritic.com';

const getHtmlElementTextNodes = (element: Node): Node[] => {
    const textNodes: Node[] = [];

    element.childNodes.forEach(childNode => {
        const childElem = childNode as HTMLElement;

        if (childElem.nodeType === 3) {
            textNodes.push(childNode);
        } else if (childElem.nodeType === 1 && (["EM", "A", "STRONG", "P", "DIV"].includes(childElem.tagName))) {
            getHtmlElementTextNodes(childElem).forEach(childTextNode => {
                textNodes.push(childTextNode);
            });
        }
    });

    return textNodes;
};

const getIGNGameReview = async (game_url: string, game_name: string, game_platform: string, review_webpage: HTMLElement): Promise<string> => {
    try {
        const article_sections = review_webpage.querySelectorAll("section.article-page");
        const verdict_sections = review_webpage.querySelectorAll("div.verdict.article-section div.article-section");
        const article_paragraphs = article_sections.flatMap(article_section => getHtmlElementTextNodes(article_section as HTMLElement));
        const verdict_paragraphs = verdict_sections.flatMap(verdict_section => getHtmlElementTextNodes(verdict_section as HTMLElement));
        const article_content = article_paragraphs.concat(verdict_paragraphs).map(node => node.innerText.trim());
        const article_text = article_content.join(' ').replace(/\&\#x27\;/g, "'").replace(/\&quot\;/g, '"').trim();

        const review_file_path = `reviews/${game_name}-${game_platform}.txt`;

        if (article_text === "") {
            throw `empty article content`;
        }

        fs.writeFileSync(review_file_path, article_text);

        return review_file_path;
    } catch (error) {
        throw `error on parsing ${game_url} (${error})`;
    }
};

export const getIGNPageReview = async (game_url: string, game_name: string, game_platform: string, from_metacritic?: boolean) => {
    try {
        const headers = { 'User-Agent': 'Mozilla/5.0' };
        const review_response = await axios.get(game_url, { headers: headers });
        const review_webpage = parse(review_response.data);

        return getIGNGameReview(game_url, game_name, game_platform, review_webpage);
    } catch (error) {
        throw `error on getting IGN review ${game_url} from ${(from_metacritic) ? 'METACRITIC' : 'IGN'} (${error})`;
    }
};

export const getIGNGameReviewThroughIGN = async (game_url: string, game_name: string, game_platform: string) => {
    try {
        const headers = { 'User-Agent': 'Mozilla/5.0' };
        const response = await axios.get(game_url, { headers: headers });

        const webpage = parse(response.data);

        const review_url = webpage.querySelectorAll('button').filter(button => button.innerText === "Read Review")[0].parentNode.getAttribute("href");

        return getIGNPageReview(`${IGN_ROOT_URL}${review_url}`, game_name, game_platform);
    } catch (error) {
        throw `error on getting through IGN ${game_url} (${error})`;
    }
};

export const getIGNGameReviewThroughMetacritic = async (game_url: string, game_name: string, game_platform: string): Promise<string> => {
    try {
        const response = await axios.get(game_url);

        const webpage = parse(response.data);

        const review_list = webpage.querySelector("ol.critic_reviews");
        const review_article_links = review_list?.querySelectorAll("div.source");

        const ign_sources = (review_article_links as HTMLElement[]).map(source => {
            const sourceChildNodes = source.childNodes;
            if (sourceChildNodes.length > 0) {
                if (sourceChildNodes[0].nodeType === 1 && (sourceChildNodes[0] as HTMLElement).tagName === "A") {
                    const url = (sourceChildNodes[0] as HTMLElement).getAttribute("href");
                    if (url?.includes('www.ign.com')) {
                        return url;
                    }
                }
            }

            return undefined;
        }).filter(source => source !== undefined) as string[];

        if (ign_sources.length === 0) {
            throw `error on looking for IGN reviews on METACRITIC ${game_url}`;
        }

        return getIGNPageReview(ign_sources[0], game_name, game_platform, true);
    } catch (error) {
        throw `error on getting METACRITIC ${game_url} (${error})`;
    }
};