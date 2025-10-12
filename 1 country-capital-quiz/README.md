# Country-Capital Quiz
A quiz application of country and it's capital.
## Setup
1. Install Postgres
2. Run `schema.sql`
    **psql -U *user_name* -d *database_name* -f *file_name*.sql**

3. import capital.csv file, it will copy the data to the created table.
3. Copy `.env.example` to `.env`
4. Run `npm install`
5. Run `node app.js`