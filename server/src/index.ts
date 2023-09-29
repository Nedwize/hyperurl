import { Elysia } from 'elysia'
import Pg from 'pg'

const PORT = process.env.PORT || 3000

const pool = new Pg.Pool({
    user: 'postgres',
    host: 'localhost',
    // database: 'api',
    password: 'postgres',
    port: 5432,
})

try {
    await pool.connect()
    console.log('🥞 connected to db')
} catch (e) {
    console.log(`couldn't connect to db`)
    console.log(e)
}

const db = [
    {
        id: 123,
        url: 'https://google.com',
    },
]

const app = new Elysia()
    .get('/', () => ({ hello: "⚡️ you've reached hyperurl" }))
    .get('/:id', ({ set, params: { id } }) => {
        // get actual url for "id" here
        const doc = db.find((c) => String(c.id) === id) || { url: '/404' }
        // redirect to url
        set.redirect = doc?.url

        // process view count, geolocation, referrer data
    })
    .get('/create-db', async () => {
        await pool.query(`CREATE DATABASE api`)
        return { message: 'done' }
    })
    .get('/create-table', async () => {
        await pool.query(`CREATE TABLE urls (
            short VARCHAR(50),
            url VARCHAR(50),
            id INTEGER
        )`)
        return { message: 'done' }
    })
    .get('/insert', async () => {
        await pool.query(
            `INSERT INTO urls(short, url, id) VALUES ('nedwize', 'www.google.com', 123)`
        )
        return { message: 'done' }
    })
    .get('/get-all', async () => {
        const kuch = await pool.query('SELECT * FROM urls')
        return { data: kuch.rows }
    })
    .get('/404', () => ({
        damn: "sorry, we couldn't find the url you were looking for, have a 🍔 instead",
    }))
    .listen(PORT)

console.log(
    `🦊 server is running at ${app.server?.hostname}:${app.server?.port}`
)
