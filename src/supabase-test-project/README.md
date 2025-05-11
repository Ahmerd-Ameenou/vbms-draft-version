# Supabase Test Project

This project is a simple application that connects to a Supabase database and fetches data from a table named "User". 

## Project Structure

```
supabase-test-project
├── src
│   ├── Supabase-client.ts  # Contains the Supabase client configuration and connection test
│   └── index.ts            # Entry point for the application
├── package.json             # npm configuration file
├── tsconfig.json            # TypeScript configuration file
└── README.md                # Project documentation
```

## Getting Started

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd supabase-test-project
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Run the application:**
   ```
   npm start
   ```

## Supabase Configuration

Make sure to replace the Supabase URL and API key in `src/Supabase-client.ts` with your own Supabase project credentials.

## License

This project is licensed under the MIT License.