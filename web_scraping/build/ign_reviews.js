"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIGNGameReviewThroughMetacritic = exports.getIGNGameReviewThroughIGN = exports.getIGNPageReview = exports.METACRITIC_ROOT_URL = exports.IGN_ROOT_URL = void 0;
var fs_1 = __importDefault(require("fs"));
var axios_1 = __importDefault(require("axios"));
var node_html_parser_1 = require("node-html-parser");
exports.IGN_ROOT_URL = 'https://www.ign.com';
exports.METACRITIC_ROOT_URL = 'https://www.metacritic.com';
var getHtmlElementTextNodes = function (element) {
    var textNodes = [];
    element.childNodes.forEach(function (childNode) {
        var childElem = childNode;
        if (childElem.nodeType === 3) {
            textNodes.push(childNode);
        }
        else if (childElem.nodeType === 1 && (["EM", "A", "STRONG", "P", "DIV"].includes(childElem.tagName))) {
            getHtmlElementTextNodes(childElem).forEach(function (childTextNode) {
                textNodes.push(childTextNode);
            });
        }
    });
    return textNodes;
};
var getIGNGameReview = function (game_url, game_name, game_platform, review_webpage) { return __awaiter(void 0, void 0, void 0, function () {
    var article_sections, verdict_sections, article_paragraphs, verdict_paragraphs, article_content, article_text, review_file_path;
    return __generator(this, function (_a) {
        try {
            article_sections = review_webpage.querySelectorAll("section.article-page");
            verdict_sections = review_webpage.querySelectorAll("div.verdict.article-section div.article-section");
            article_paragraphs = article_sections.flatMap(function (article_section) { return getHtmlElementTextNodes(article_section); });
            verdict_paragraphs = verdict_sections.flatMap(function (verdict_section) { return getHtmlElementTextNodes(verdict_section); });
            article_content = article_paragraphs.concat(verdict_paragraphs).map(function (node) { return node.innerText.trim(); });
            article_text = article_content.join(' ').replace(/\&\#x27\;/g, "'").replace(/\&quot\;/g, '"').trim();
            review_file_path = "reviews/".concat(game_name, "-").concat(game_platform, ".txt");
            if (article_text === "") {
                throw "empty article content";
            }
            fs_1.default.writeFileSync(review_file_path, article_text);
            return [2 /*return*/, review_file_path];
        }
        catch (error) {
            throw "error on parsing ".concat(game_url, " (").concat(error, ")");
        }
        return [2 /*return*/];
    });
}); };
var getIGNPageReview = function (game_url, game_name, game_platform, from_metacritic) { return __awaiter(void 0, void 0, void 0, function () {
    var headers, review_response, review_webpage, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                headers = { 'User-Agent': 'Mozilla/5.0' };
                return [4 /*yield*/, axios_1.default.get(game_url, { headers: headers })];
            case 1:
                review_response = _a.sent();
                review_webpage = (0, node_html_parser_1.parse)(review_response.data);
                return [2 /*return*/, getIGNGameReview(game_url, game_name, game_platform, review_webpage)];
            case 2:
                error_1 = _a.sent();
                throw "error on getting IGN review ".concat(game_url, " from ").concat((from_metacritic) ? 'METACRITIC' : 'IGN', " (").concat(error_1, ")");
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getIGNPageReview = getIGNPageReview;
var getIGNGameReviewThroughIGN = function (game_url, game_name, game_platform) { return __awaiter(void 0, void 0, void 0, function () {
    var headers, response, webpage, review_url, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                headers = { 'User-Agent': 'Mozilla/5.0' };
                return [4 /*yield*/, axios_1.default.get(game_url, { headers: headers })];
            case 1:
                response = _a.sent();
                webpage = (0, node_html_parser_1.parse)(response.data);
                review_url = webpage.querySelectorAll('button').filter(function (button) { return button.innerText === "Read Review"; })[0].parentNode.getAttribute("href");
                return [2 /*return*/, (0, exports.getIGNPageReview)("".concat(exports.IGN_ROOT_URL).concat(review_url), game_name, game_platform)];
            case 2:
                error_2 = _a.sent();
                throw "error on getting through IGN ".concat(game_url, " (").concat(error_2, ")");
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getIGNGameReviewThroughIGN = getIGNGameReviewThroughIGN;
var getIGNGameReviewThroughMetacritic = function (game_url, game_name, game_platform) { return __awaiter(void 0, void 0, void 0, function () {
    var response, webpage, review_list, review_article_links, ign_sources, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios_1.default.get(game_url)];
            case 1:
                response = _a.sent();
                webpage = (0, node_html_parser_1.parse)(response.data);
                review_list = webpage.querySelector("ol.critic_reviews");
                review_article_links = review_list === null || review_list === void 0 ? void 0 : review_list.querySelectorAll("div.source");
                ign_sources = review_article_links.map(function (source) {
                    var sourceChildNodes = source.childNodes;
                    if (sourceChildNodes.length > 0) {
                        if (sourceChildNodes[0].nodeType === 1 && sourceChildNodes[0].tagName === "A") {
                            var url = sourceChildNodes[0].getAttribute("href");
                            if (url === null || url === void 0 ? void 0 : url.includes('www.ign.com')) {
                                return url;
                            }
                        }
                    }
                    return undefined;
                }).filter(function (source) { return source !== undefined; });
                if (ign_sources.length === 0) {
                    throw "error on looking for IGN reviews on METACRITIC ".concat(game_url);
                }
                return [2 /*return*/, (0, exports.getIGNPageReview)(ign_sources[0], game_name, game_platform, true)];
            case 2:
                error_3 = _a.sent();
                throw "error on getting METACRITIC ".concat(game_url, " (").concat(error_3, ")");
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getIGNGameReviewThroughMetacritic = getIGNGameReviewThroughMetacritic;
