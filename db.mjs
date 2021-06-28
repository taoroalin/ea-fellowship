import * as pgpkg from "pg"
const Client = pgpkg.default.Client

export async function connect() {
  const client = new Client({
    user: 'me',
    // host: 'localhost',
    host: '207.246.127.247',
    database: 'tdb1',
    password: 'morEAtel',
    port: 5432,
  })
  // const client = new Client()
  await client.connect() // gets credentials from environment variables
  console.log(client)
  return client
}

export async function examply(client) {
  const res = await client.query('SELECT * from users')
  console.log(res.rows)
  console.log(res.rows[0].message)
}