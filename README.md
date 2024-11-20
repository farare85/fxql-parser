# FXQL Parser

## Overview

The FXQL Parser is a NestJS-based system that parses and validates Foreign Exchange Query Language (FXQL) statements. It ensures the correctness of FXQL syntax, processes valid entries, and stores them in the database, while providing detailed feedback for both successful and failed operations. Live at [https://fxql-parser.xyz](https://fxql-parser.xyz)

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- PostgreSQL database

### Setup Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/fxql-parser.git
   ```

2. Navigate to the project directory:

   ```bash
   cd fxql-parser
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up environment variables:

   - Create a `.env` file in the root directory according to the `.env.sample` file

5. Run migrations:
   ```bash
   npm run migration:run
   
5. Run the application:
   ```bash
   npm run start
   ```

The API documentation will be available at `http://localhost:3000`

## Validation Rules

### Currency Pair (CURR1-CURR2)

- CURR1 and CURR2 must be exactly 3 uppercase characters (e.g., USD, GBP, EUR)
- Example: USD-GBP

### BUY and SELL

- Numeric amount in CURR2 per unit of CURR1
- Must be a positive number
- Example: 100, 0.85

### CAP

- Maximum transaction amount in CURR1
- Must be a whole number
- 0 indicates no cap

### Formatting

- Statements must have a single space between the currency pair and the opening {
- Each statement must be separated by a single newline
