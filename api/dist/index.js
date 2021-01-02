"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
class App {
    constructor() {
        this.app = express_1.default();
    }
    connect() {
        this.app.listen(4000, () => {
            console.log('All good!');
        });
    }
}
exports.default = App;
//# sourceMappingURL=index.js.map