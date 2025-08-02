# Testing Custom Domain Locally

To test the middleware works locally:

1. Edit your `/etc/hosts` file:
```bash
sudo nvim /etc/hosts
```

2. Add this line:
```
127.0.0.1 random.theresureishope.tech
```

3. Start your dev server:
```bash
npm run dev
```

4. Visit `http://random.theresureishope.tech:3000` in your browser

This will simulate the custom domain hitting your local Next.js app, allowing you to test the middleware.

## Production Setup

For production, you need to:

1. **Configure your hosting provider** to accept requests from custom domains
2. **Add wildcard domain support** (e.g., `*.theresureishope.tech`)
3. **Set up SSL certificates** for custom domains

### Vercel Configuration:
- Project Settings → Domains → Add `*.theresureishope.tech`
- Vercel will automatically handle SSL certificates

### Custom Server Setup:
If using a custom server, you need to configure your reverse proxy (nginx, cloudflare, etc.) to route custom domains to your Next.js app.