import { serve } from 'bun'
import index from './index.html'
import './styles.css'

const apiKey = 'AIzaSyAXbMwSXzx2sAlvY8UD78FLlnor_KBE2Mc'
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`
console.log('API_KEY:', apiKey)

const server = serve({
  routes: {
    '/': index,
    '/api/gemini': {
      async POST(req) {
        console.log('Got request')
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: req.body,
        })

        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: {
            'content-type': 'application/json; charset=UTF-8',
          },
        })
      },
    },
  },
})

console.log(`Bun server listening on port http://localhost:${server.port}`)
