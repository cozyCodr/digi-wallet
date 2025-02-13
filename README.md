# DigiWallet - Digital Wallet Solution

A full-stack digital wallet application built with .NET 8 backend and Next.js frontend.

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Bun](https://bun.sh) for frontend package management
- [PostgreSQL](https://www.postgresql.org/download/)

## Quick Start

1. Clone the repository:

```bash
  git clone https://github.com/cozyCodr/digi-wallet.git
  cd digi-wallet
```

2. Set up backend

```bash
   cd DigiWallet
  cp .env.example .env    # Configure your environment variables
  dotnet restore
  dotnet ef database update  # Update database
  dotnet run
```

3. Setup Frontend

```bash
  cd frontend
  cp .env.example .env    # Configure your environment variables
  bun install
  bun dev
```

## API Documentation

Swagger UI is available at: http://localhost:5053/swagger