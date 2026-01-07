# Deployment Status: ⚠️ Connectivity Issue

## Current State
- **Application**: Running on http://159.198.40.133:3001
- **Status**: 500 Internal Server Error (Database Connection)
- **Deployment**: Successful (Docker container `kidokool-lms`)

## The Issue
The database URL provided is an **IPv6 address** (`[2406:da1a:...]`).
The VPS **does not support IPv6** (tested with `ping6`).

## Solution Required
You need to update the `DATABASE_URL` in `.env.production` on the VPS with an **IPv4-compatible URL**.
- **Supabase**: Use the **Connection Pooling** URL (port 5432 or 6543) or the **Direct** URL with the **HOSTNAME** (e.g., `db.xyz.supabase.co`), NOT the IP address.

## How to Fix
1. Get the correct URL from Supabase Dashboard -> Project Settings -> Database -> Connection String.
2. Run this command on your machine:
```bash
ssh root@159.198.40.133
nano /var/www/kidokool-lms/.env.production
# Replace DATABASE_URL with the new hostname-based URL
docker restart kidokool-lms
```
