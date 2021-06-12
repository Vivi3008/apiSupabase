"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv = __importStar(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const ts_dotenv_1 = require("ts-dotenv");
dotenv.config();
const env = ts_dotenv_1.load({
    SUPABASE_KEY: String,
    SUPABASE_URL: String,
});
const supabaseUrl = env.SUPABASE_URL;
const supabaseKey = env.SUPABASE_KEY;
const supabase = supabase_js_1.createClient(supabaseUrl, supabaseKey);
const app = express_1.default();
app.use(express_1.default.json());
app.use(cors_1.default());
const Message = async (res, error, data) => {
    const erroMsg = 'Erro interno no servidor!';
    const erro = Object.assign({ erroMsg }, error);
    error ? res.json(erro) : res.json(data);
    return error ? false : true;
};
app.get('/', async (req, res) => {
    let { data, error } = await supabase
        .from('todos')
        .select('*');
    await Message(res, error, data);
});
app.post('/insert', async (req, res) => {
    const { todo } = req.body;
    const { data, error } = await supabase
        .from('todos')
        .insert([
        { task: todo },
    ]);
    await Message(res, error, data);
});
app.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);
    (data === null || data === void 0 ? void 0 : data.length) === 0 ? res.send('Id inexistente!') : res.send(data);
    return error ? false : true;
});
app.listen(process.env.PORT || 3300);
