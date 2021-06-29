import * as pgpkg from "pg"
import * as phooks from "perf_hooks"
const performance = phooks.performance
const Client = pgpkg.default.Client

export async function connect() {
  // yep dev database credentials are in source code
  const client = new Client({
    user: 'me',
    // host: 'localhost',
    host: '207.246.127.247',
    database: 'dev',
    password: 'morEAtel',
    //u postgres p ASTranTar
    port: 5432,
  })
  // const client = new Client()
  await client.connect() // gets credentials from environment variables
  console.log(client)
  return client
}

// export async function createFellowship(client) {
//   const result = await client.query(`INSERT INTO fellowships (name, start_date, end_date, session_count) VALUES ($1, $2, $3, $4)`, [])
// }

export async function examply(client) {
  const res = await client.query('SELECT * from users')
  console.log(res.rows)
  console.log(res.rows[0].message)
}

export async function setupDB(client) {
  const stime = performance.now()
  // await client.query(`CREATE EXTENSION hstore`)
  const tableschemas = {
    users: `
    user_id SERIAL PRIMARY KEY,
    email TEXT,
    name_first TEXT,
    name_last TEXT,
    password VARCHAR(255),
    created_at timestamp with time zone
    `,
    fellowships: `
    fellowship_id SERIAL PRIMARY KEY,
    general_name text,
    name text,
    start_date date,
    end_date date,
    session_count int
    `,
    cohorts: `
    cohort_id SERIAL PRIMARY KEY,
    cohort_number INT,
    meeting_time timestamp with time zone,
    fellowship_id INTEGER REFERENCES fellowships(fellowship_id)
    `,
    organizers: `
    organizer_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    fellowship_id INTEGER REFERENCES fellowships(fellowship_id)
    `,
    facilitators: `
    facilitator_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    cohort_id INTEGER REFERENCES cohorts(cohort_id)
    `,
    participants: `
    participant_id SERIAL PRIMARY KEY,
    cohort_id INTEGER REFERENCES cohorts(cohort_id),
    user_id INTEGER REFERENCES users(user_id),
    promisingness real
    `,
    emails: `
    email_id SERIAL PRIMARY KEY,
    subject text,
    body text,
    fellowship_id INTEGER REFERENCES fellowships(fellowship_id),
    field_descriptions hstore
    `,
  }
  const order = Object.keys(tableschemas)
  for (let i = order.length - 1; i >= 0; i--) {
    await client.query(`DROP TABLE IF EXISTS ${order[i]}`)
  }
  for (let i = 0; i < order.length; i++) {
    await client.query(`CREATE TABLE ${order[i]} (${tableschemas[order[i]]})`)
  }
  console.log(`took ${performance.now() - stime}`)
}