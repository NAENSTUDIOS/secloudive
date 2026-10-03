import http from 'http'

const req = http.get('http://localhost:5173/', (res) => {
  let data = ''
  res.on('data', chunk => { data += chunk })
  res.on('end', () => {
    console.log('HTTP Status Code:', res.statusCode)
    console.log('HTML Length:', data.length)
    console.log('Contains root element:', data.includes('id="root"'))
    console.log('Headers:', res.headers['content-type'])
  })
})

req.on('error', (err) => {
  console.error('Connection failed:', err.message)
})
