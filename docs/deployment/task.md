# Darikana Kitchen VPS Deployment Task Checklist & Commands

Run these commands in order on your VPS (logged in as `devuser` with `sudo` privileges).

> **Architecture Overview:**  
> This project is a modern **React 19 + Vite** Single Page Application (SPA). Unlike NC-Electro (which requires PostgreSQL, Go backend, and Next.js) and NE-Dhanya (Next.js SSR service), Darikana Kitchen is a pure client-side SPA that compiles into static HTML, CSS, and JS bundles (`dist/`) while connecting directly to **Firebase** (Firestore & Auth) and **Cloudinary** (direct browser uploads with Web Crypto SHA-1 signing).  
>
> **Serving Approach:**
> - **Primary & Recommended (Nginx Static SPA):** Nginx serves `/var/www/darikanakitchen.in/dist` directly with `try_files $uri $uri/ /index.html;`. This requires **0 background RAM**, **0 ports** (preventing any collision with ports `3000-3003`, `3005`, and `8080`), and delivers the fastest possible static asset load times.
> - **Alternative (Systemd Node Service on Port 3006):** Provided in Section 6 if you prefer running it as a Node-backed preview service behind a reverse proxy.

---

## 1. DNS Configuration
Before configuring the server, add the following **A Records** in your domain DNS manager (Hostinger, GoDaddy, Namecheap, Cloudflare, etc.) for `darikanakitchen.in`:

- [ ] **A Record:** `@` &rarr; `<YOUR_VPS_IP>` (Apex domain: `darikanakitchen.in`)
- [ ] **A Record:** `www` &rarr; `<YOUR_VPS_IP>` (Subdomain: `www.darikanakitchen.in`)

*Verify DNS propagation from your local terminal before generating SSL certificates:*
```bash
dig +short darikanakitchen.in
dig +short www.darikanakitchen.in
```

---

## 2. Server Dependencies Check
Verify that the VPS has Node.js (v18+ or v20+), npm, and Nginx ready:

- [ ] **Verify Core Packages & Runtimes**
  ```bash
  # Check Node and npm
  node -v
  npm -v

  # Check Nginx and Certbot
  nginx -v
  certbot --version
  ```

  *(If Node.js is not installed or version < 18, install Node 20 LTS:)*
  ```bash
  # curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  # sudo apt-get install -y nodejs
  ```

---

## 3. Directory Structure Setup

- [ ] **Create Web Directory Hierarchy**
  ```bash
  # Create application directory
  sudo mkdir -p /var/www/darikanakitchen.in
  sudo chown -R devuser:devuser /var/www/darikanakitchen.in
  ```

---

## 4. Application Deployment (Vite + React)

- [ ] **Clone Repository**
  ```bash
  cd /var/www/darikanakitchen.in

  # Clone repo using SSH (Recommended)
  git clone git@github.com:glovadev/Darikana-Kitchen.git .

  # (Alternative: using HTTPS)
  # git clone https://github.com/glovadev/Darikana-Kitchen.git .
  ```

- [ ] **Install Dependencies & Build Production Bundle**
  ```bash
  cd /var/www/darikanakitchen.in

  # Install project dependencies
  npm install

  # Build the production static bundle (creates the 'dist' directory)
  npm run build
  ```

- [ ] **Verify Build Output**
  ```bash
  # Check that index.html and assets exist in dist/
  ls -la /var/www/darikanakitchen.in/dist
  ```

---

## 5. Nginx Configuration (Recommended: Direct Static SPA)

Because Darikana Kitchen compiles to optimized static assets, serving it directly via Nginx is the industry standard. It avoids running an idle Node.js process 24/7 and ensures zero port conflict with existing apps (`3000-3005`, `8080`).

- [ ] **Create Nginx Server Block**

  *Option A — Using `nano` editor (Cleanest & easiest to avoid terminal paste issues):*
  ```bash
  sudo nano /etc/nginx/sites-available/darikanakitchen.in
  ```
  *(Paste the configuration below, then press `Ctrl+O`, `Enter`, and `Ctrl+X` to save)*

  *Option B — Or run this command directly in your terminal:*
```bash
sudo tee /etc/nginx/sites-available/darikanakitchen.in > /dev/null << 'EOF'
server {
    listen 80;
    server_name darikanakitchen.in www.darikanakitchen.in;

    root /var/www/darikanakitchen.in/dist;
    index index.html;

    # Allow image uploads up to 25MB
    client_max_body_size 25M;

    # Enable Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/javascript application/xml+rss application/json image/svg+xml;

    # Handle client-side routing (React Router / SPA)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets (Vite hashed bundles in assets/)
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
        access_log off;
    }

    # Static images and public assets
    location ~* \.(?:ico|png|jpg|jpeg|gif|svg|webp|woff2?|eot|ttf)$ {
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
        access_log off;
    }
}
EOF
```

- [ ] **Enable Site & Test Nginx Configuration**
  ```bash
  sudo ln -sf /etc/nginx/sites-available/darikanakitchen.in /etc/nginx/sites-enabled/
  sudo nginx -t
  sudo systemctl reload nginx
  ```

---

## 6. (Alternative Option) Systemd Node Service Setup on Port 3006

*Only follow this step if you prefer running a Node process with a reverse proxy instead of direct static serving (similar to NE-Dhanya).*

- [ ] **(Optional) Create Systemd Service File**
```bash
sudo tee /etc/systemd/system/darikana.service > /dev/null << 'EOF'
[Unit]
Description=Darikana Kitchen Preview Service
After=network.target

[Service]
User=devuser
WorkingDirectory=/var/www/darikanakitchen.in
ExecStart=/usr/bin/npm run preview -- --port 3006 --host 0.0.0.0
Restart=always
RestartSec=5
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF
```

- [ ] **(Optional) Enable & Start Systemd Service**
  ```bash
  sudo systemctl daemon-reload
  sudo systemctl enable darikana
  sudo systemctl start darikana
  sudo systemctl status darikana --no-pager
  ```

- [ ] **(Optional) Nginx Proxy Pass Block (if using Port 3006)**
  If using this alternative, replace the `location /` block in `/etc/nginx/sites-available/darikanakitchen.in` with:
  ```nginx
  location / {
      proxy_pass http://localhost:3006;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
  }
  ```
  Then reload Nginx:
  ```bash
  sudo nginx -t && sudo systemctl reload nginx
  ```

---

## 7. Generate SSL Certificate with Let's Encrypt (Certbot)

Once DNS is propagated and Nginx is answering HTTP requests:

- [ ] **Request and Install SSL Certificate**
  ```bash
  sudo certbot --nginx -d darikanakitchen.in -d www.darikanakitchen.in
  ```
  *(Select option to automatically redirect HTTP to HTTPS if prompted)*

- [ ] **Verify Auto-Renewal Configuration**
  ```bash
  sudo certbot renew --dry-run
  ```

---

## 8. Verification & Health Checks

- [ ] **Test Web Application in Browser**
  - **Homepage & Hero:** `https://darikanakitchen.in`
  - **Menu & Filtering:** `https://darikanakitchen.in/menu`
  - **Tiffin Service / Bookings:** `https://darikanakitchen.in/tiffin`
  - **Direct Client-Side Route Refresh:** Refresh any page (e.g., `https://darikanakitchen.in/admin`) to confirm `try_files` correctly routes to `index.html` without returning an Nginx 404.
  - **Admin Panel & Authentication:** Log in at `https://darikanakitchen.in/admin` using authorized Firebase credentials.
  - **Cloudinary Image Upload:** Test uploading a dish photo inside the Admin dashboard to confirm Web Crypto direct upload to Cloudinary.

- [ ] **Check Logs if Troubleshooting is Needed**
  ```bash
  # Check Nginx error and access logs
  sudo tail -n 50 -f /var/log/nginx/error.log
  sudo tail -n 50 -f /var/log/nginx/access.log

  # (If using Option 6 Systemd service)
  # journalctl -u darikana -f
  ```

---

## 9. Ongoing Updates (Pulling Latest Code)

Whenever you push code changes to the repository:

- [ ] **Deploy Latest Changes**
  ```bash
  cd /var/www/darikanakitchen.in
  git pull origin main

  # Install dependencies (if new packages were added)
  npm install

  # Rebuild the production bundle
  npm run build
  ```
  *(With the direct Nginx static setup, updates are instantly live the moment `npm run build` completes! No service restarts required.)*
