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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var yaml = require("js-yaml");
var db_1 = require("../src/lib/db");
function importData() {
    return __awaiter(this, void 0, void 0, function () {
        var db, fileContents, data, _i, _a, talk, _b, _c, article;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, (0, db_1.setupDb)()];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, (0, db_1.getDb)()];
                case 2:
                    db = _d.sent();
                    fileContents = fs.readFileSync('etc/data.yaml', 'utf8');
                    data = yaml.load(fileContents);
                    // Clear existing data
                    return [4 /*yield*/, db.run('DELETE FROM talks')];
                case 3:
                    // Clear existing data
                    _d.sent();
                    return [4 /*yield*/, db.run('DELETE FROM articles')];
                case 4:
                    _d.sent();
                    _i = 0, _a = data.talks;
                    _d.label = 5;
                case 5:
                    if (!(_i < _a.length)) return [3 /*break*/, 8];
                    talk = _a[_i];
                    return [4 /*yield*/, db.run("INSERT INTO talks (title, event, date, location, country_code, session_url, video_url, slides_url, status, tags)\n       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", talk.title, talk.event, talk.date, talk.location, talk.country_code, talk.session_url, talk.video_url, talk.slides_url, talk.status, talk.tags.join(','))];
                case 6:
                    _d.sent();
                    _d.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 5];
                case 8:
                    _b = 0, _c = data.articles;
                    _d.label = 9;
                case 9:
                    if (!(_b < _c.length)) return [3 /*break*/, 12];
                    article = _c[_b];
                    return [4 /*yield*/, db.run("INSERT INTO articles (title, url, publish_date, tags)\n       VALUES (?, ?, ?, ?)", article.title, article.url, article.publish_date, article.tags.join(','))];
                case 10:
                    _d.sent();
                    _d.label = 11;
                case 11:
                    _b++;
                    return [3 /*break*/, 9];
                case 12:
                    console.log('Data imported successfully!');
                    return [2 /*return*/];
            }
        });
    });
}
importData().catch(console.error);
