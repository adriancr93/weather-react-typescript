**Weather React (TypeScript)**

An introduction to APIs and how to call them from a React + Vite + TypeScript app, with practical examples.

**What is an API?**
- **API** stands for Application Programming Interface.
- It is a set of functions and endpoints provided by a service (server, library, or framework) that other programs can call to interact with data or features.
- APIs often expose resources hosted on a different server or database and return structured responses (commonly JSON).

**Why use an API from React?**
- A React app running in the browser cannot directly access a database. Instead, it fetches dynamic data from an API.
- Backends that provide APIs can be written in any language or framework (Node/Express, Python/Flask/Django, Java, .NET, PHP/Laravel, etc.).

**Data format and keys**
- Most public and private APIs return JSON. Some require an API key (authentication) and others may be blocked by CORS unless configured properly.

**How to fetch data in React**
- Use the browser `fetch` API, `axios`, or data-fetching libraries such as `SWR` or `react-query` (TanStack Query) to request and cache API responses.

**This README contains:**
- A quick setup guide for this Vite + React + TypeScript project.
- Examples using `fetch` and `axios` (JavaScript and TypeScript).
- An example using the OpenWeatherMap API.
- Notes about CORS and a Vite proxy configuration.

**Table of Contents**
- Installation
- Running locally
- Simple examples (Fetch, Axios)
- TypeScript example (hook)
- OpenWeatherMap example
- CORS & Vite proxy
- Next steps

**Installation**
1. Clone the repository and install dependencies:

```bash
git clone <repo-url>
cd weather-react-typescript
npm install
```

2. Start the dev server:

```bash
npm run dev
```

**Running build**

```bash
npm run build
npm run preview
```

**Simple Fetch Example (JavaScript / React)**
Use this in a component to fetch JSON from any public API.

```jsx
import {useEffect, useState} from 'react'

function ExampleFetch() {
	const [data, setData] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		fetch('https://api.example.com/resource')
			.then(res => {
				if (!res.ok) throw new Error('Network response was not ok')
				return res.json()
			})
			.then(json => setData(json))
			.catch(err => setError(err))
			.finally(() => setLoading(false))
	}, [])

	if (loading) return <div>Loading...</div>
	if (error) return <div>Error: {error.message}</div>
	return <pre>{JSON.stringify(data, null, 2)}</pre>
}

export default ExampleFetch
```

**Axios Example (JavaScript / React)**

```jsx
import axios from 'axios'
import {useEffect, useState} from 'react'

function ExampleAxios() {
	const [posts, setPosts] = useState([])

	useEffect(() => {
		axios.get('https://jsonplaceholder.typicode.com/posts')
			.then(res => setPosts(res.data))
			.catch(console.error)
	}, [])

	return (
		<ul>
			{posts.map(p => <li key={p.id}>{p.title}</li>)}
		</ul>
	)
}

export default ExampleAxios
```

**TypeScript Hook Example (useApi)**
Reusable hook with generics for typed responses.

```ts
import {useEffect, useState} from 'react'

export function useApi<T>(url: string) {
	const [data, setData] = useState<T | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<Error | null>(null)

	useEffect(() => {
		let mounted = true
		fetch(url)
			.then(res => {
				if (!res.ok) throw new Error('Network response was not ok')
				return res.json() as Promise<T>
			})
			.then(json => { if (mounted) setData(json) })
			.catch(err => { if (mounted) setError(err) })
			.finally(() => { if (mounted) setLoading(false) })

		return () => { mounted = false }
	}, [url])

	return {data, loading, error}
}
```

**OpenWeatherMap Example (fetch)**
Sign up at https://openweathermap.org/ and get an API key. Example for current weather by city name:

```ts
const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_KEY
const city = 'London'
const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`

fetch(url)
	.then(res => res.json())
	.then(data => console.log(data))
	.catch(console.error)
```

Add your key to a `.env` (Vite) file at project root:

```
VITE_OPENWEATHERMAP_KEY=your_api_key_here
```

Then restart the dev server.

**CORS notes**
- CORS (Cross-Origin Resource Sharing) is a browser security feature. If an API doesn't include permissive CORS headers, the browser will block requests from your frontend.
- Solutions:
	- Use a backend proxy (recommended for private keys).
	- Configure the API server to add `Access-Control-Allow-Origin: *` or specific origin.
	- Use Vite dev server proxy for local development (example below).

**Vite Proxy Example**
Add a proxy to `vite.config.ts` to forward API calls during development.

```ts
// vite.config.ts (partial)
import {defineConfig} from 'vite'

export default defineConfig({
	server: {
		proxy: {
			'/api': {
				target: 'https://api.example.com',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, '')
			}
		}
	}
})
```

With this, a request to `/api/weather` in the browser will be proxied to `https://api.example.com/weather`.

**Next steps / Tips**
- For advanced caching and background revalidation use `react-query` or `SWR`.
- Keep API keys out of client bundles — route sensitive calls through a backend.
- Add error handling, loading states, retries, and request cancellation for production readiness.

If you want, I can also:
- Add a sample component that shows live weather using OpenWeatherMap and the `useApi` hook.
- Configure Vite proxy in `vite.config.ts` with a concrete example for a public API.
- Add `axios` to `package.json` and wire examples into the project.

---
Created from the original Spanish notes to make a clear, practical README for this project.s