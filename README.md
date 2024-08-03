## Getting Started

First, run the development server:

```bash
npm run dev
# or
pnpm dev
```

Second, run the JSON database server:

```bash
npx json-server --watch data/db.json --port 8000
# or
pnpm dlx json-server --watch data/db.json --port 8000
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
