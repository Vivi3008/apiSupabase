import express, { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { load } from 'ts-dotenv'

dotenv.config()

const env = load({
    SUPABASE_KEY: String,
    SUPABASE_URL: String,
})

const supabaseUrl = env.SUPABASE_URL;
const supabaseKey = env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express()
app.use(express.json())
app.use(cors());


const Message = async (res: Response, error: any, data: any) => {
    const erroMsg = 'Erro interno no servidor!';

    const erro = {
        erroMsg,
        ...error,
    }

    error ? res.json(erro) : res.json(data);
    return error ? false : true;
}

app.get('/', async (req: Request, res: Response) => {
    let { data, error } = await supabase
        .from('todos')
        .select('*')

    await Message(res, error, data);
})

app.post('/insert', async (req: Request, res: Response) => {
    const { todo } = req.body;

    const { data, error } = await supabase
        .from('todos')
        .insert([
            { task: todo },
        ]);

    await Message(res, error, data)
})

app.delete('/delete/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

    data?.length === 0 ? res.send('Id inexistente!') : res.send(data);
    return error ? false : true;
})

app.put('/update/:id', async (req: Request, res: Response) => {
    const { id, status, task } = req.params;

    const { data, error } = await supabase
        .from('todos')
        .update({ status: status })
        .match({ 'id': id });

    await Message(res, error, data)
})

app.listen(process.env.PORT || 3300)