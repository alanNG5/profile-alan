Summary:

1. Hashed password is adopted with the use of package of "bcryptjs".

2. Using "Invalid password or username." as an error message got from POST of login is better than separation of messages of "Username not found." and "Invalid password.", based on consideration for security of user account.

3. Validation of user registry is proceeded at front end.

4. Stock quantity varied with Sales. Item Insert and stock update proceed under same transaction unit so as to fulfill transaction principle of atomicity. Rollback is run if this process fails.

5. To prevent the scenario of triggering user purchase of goods that is out of stock, database query block the item information to be fetched in frontend. On the other hand, stock availability is checked prior to creation of new sales to ensure this scenrio not to happen.

6. To tackle with memory leakage due to express-session, npm package of "memorystore" is introduced.

Based on MVP

Improvement plan:
    - Database Transaction: When sales is triggered, quantity of product in stock should be deducted. Another error handling is necessary as SQL query for UPDATE and INSERT are involved.

    - Feature of creation of PDF file about transaction for download.

    - The npm package of "connect-pg-simple" is necessary to be installed to replace "memorystore" for handling memory leakage as it stores session in PostreSQL Database so it is more suitable for production and scales better and persists session data across server restarts. As "pg" is required for connection pool, Knex configuration maybe set up again.

    - Error handling



Contraints applied to different users.

Additional transaction date as a field added to sales table.




// 1
Transaction Management: running more than one SQL query as both INSERT and UPDATE are applied when sales is triggered.


You can handle both the insertion into the Sales table and the update of the Products table within the same POST route. This approach ensures that both operations are executed together and can be rolled back if something goes wrong, maintaining data integrity.

Here's a basic example using Express and a PostgreSQL client like pg:

javascript

複製
const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const pool = new Pool({
  user: 'yourUsername',
  host: 'localhost',
  database: 'yourDatabase',
  password: 'yourPassword',
  port: 5432,
});

app.post('/sales', async (req, res) => {
  const client = await pool.connect();
  try {
    const { productId, quantitySold } = req.body;

    await client.query('BEGIN');

    // Insert into Sales table
    const insertSalesQuery = `
      INSERT INTO Sales (product_id, quantity_sold)
      VALUES ($1, $2) RETURNING id`;
    const salesResult = await client.query(insertSalesQuery, [productId, quantitySold]);

    // Update the Products table
    const updateProductQuery = `
      UPDATE Products
      SET quantity = quantity - $1
      WHERE id = $2`;
    await client.query(updateProductQuery, [quantitySold, productId]);

    await client.query('COMMIT');

    res.status(201).json({ salesId: salesResult.rows[0].id });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error performing transaction', error);
    res.status(500).json({ error: 'An error occurred' });
  } finally {
    client.release();
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});


Key Points:
Transaction Management: Use transactions to ensure that both operations succeed or fail together. Begin a transaction before the operations and commit it if both are successful. Rollback if any operation fails.
Single Route: You can handle both the sale and the product update in the same route. This is often simpler and ensures consistency.
Error Handling: Make sure to handle errors and rollback transactions if something goes wrong.
Atomicity: This setup ensures atomicity, meaning either both changes occur, or neither do.
This approach is generally preferable for ensuring consistency and making the API simpler for clients to use, as they only need to make one request.

Notes:

Under CSS folder, any relative path to retrieve target file starts from it's own working directory. For the path coded in JS file, it must be start from the directory to which the corresponding HTML file belongs.

//2 - testing
knex
  .select("*")
  .from("students")
  .then((students) => {
    const studentNames = students.reduce((set, student) => {
      set.add(elem.subject);
      return set;
    }, new Set());
  });
