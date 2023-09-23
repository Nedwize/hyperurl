import { Elysia } from 'elysia'

const PORT = process.env.PORT || 3000

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
    .get('/404', () => ({
        damn: "sorry, we couldn't find the url you were looking for, have a 🍔 instead",
    }))
    .listen(PORT)

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
