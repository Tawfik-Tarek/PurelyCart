import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '@/server/schema';

console.log(process.env.POSTGRES_URL);


const sql = neon(process.env.POSTGRES_URL as string);

const db = drizzle(sql , {schema , logger:true});

export default db;