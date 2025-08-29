import { serve } from 'bun'
import index from './index.html'
import './styles.css'

const server = serve({
  routes: {
    '/': index,
  },
})

console.log(`Bun server listening on port http://localhost:${server.port}`)
