import * as fetchpkg from "node-fetch"
const fetch = fetchpkg.default

const consecutiveDays = (start, count) => {
  let date = new Date(start)
  const result = []
  for (let i = 0; i < count; i++) {
    result.push(date.toISOString().slice(0, 10))
    date.setDate(date.getDate() + 1)
  }
  return result
}

export async function createDayOfWeekLettuceMeet(title, description, startDate, timeZone) {
  const startTime = "01"
  const endTime = "23"
  const dates = consecutiveDays(startDate, 7)
  const result = await createLettuceMeet(title, description, dates, timeZone, startTime, endTime)
  return result
}

export async function createLettuceMeet(title, description, dateStrings, timeZone, startTime, endTime) {
  const randomMutationIdThing = Math.random().toString()
  const body = JSON.stringify({ "id": `mutation${randomMutationIdThing}`, "query": "mutation CreateEventMutation($input_0:CreateEventInput!) {createEvent(input:$input_0) {clientMutationId,...F0}} fragment F0 on CreateEventPayload {event {user {events {id},id},id}}", "variables": { "input_0": { title, description, "pollStartTime": `${startTime}:00:00Z`, "pollEndTime": `${endTime}:00:00Z`, "pollDates": dateStrings, timeZone, "clientMutationId": "0" } } })
  const response = await fetch("https://api.lettucemeet.com/graphql", {
    method: "POST",
    headers: {
      origin: "https://lettucemeet.com",
      referrer: "https://lettucemeet.com/",
      "content-type": "application/json",
      "sec-ch-ua": `" Not A;Brand";v="99", "Chromium";v="90"`,
      "user-agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36`
    },
    body
  })
  const json = await response.json()
  if (response.status !== 200) {
    console.error(`lettucemeet didn't accept request`)
    console.log(response)
    console.log("json")
    console.log(json)
    return
  }
  const id = json.data.createEvent.event.id
  if (!id) {
    console.error("lettucemeet response unreadable")
    console.log(JSON.stringify(json))
    return
  }
  return `https://lettucemeet.com/l/${id}`
}

const demoCreateLM = async () => {
  const lmUrl = await createDayOfWeekLettuceMeet("title", "description", Date.now(), "America/New_York")
  console.log(lmUrl)
}