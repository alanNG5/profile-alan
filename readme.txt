Summary:

1. Hashed password is adopted with the use of package of "bcryptjs".

2. Using "Invalid password or username." as an error message got from POST of login is better than separation of messages of "Username not found." and "Invalid password.", based on consideration for security of user account.

3. Validation of user registry is proceeded at front end.

4. Stock quantity varied with Sales. Item Insert and stock update proceed under same transaction unit so as to fulfill transaction principle of atomicity. Rollback is run if this process fails.

5. To prevent the scenario of triggering user purchase of goods that is out of stock, database query block the item information to be fetched in frontend. On the other hand, stock availability is checked prior to creation of new sales to ensure this scenrio not to happen.

6. To tackle with memory leakage due to express-session, npm package of "memorystore" is introduced.

7. The object of date is handled in frontend after response from database. It allows adjustment of date based on the local format in client side. In practise, input of date is parsed in JSON and output of date string is proceeded by constructor.

8. dynamic report, date

Based on MVP

Improvement plan:
    - Database Transaction: When sales is triggered, quantity of product in stock should be deducted. Another error handling is necessary as SQL query for UPDATE and INSERT are involved.

    - Feature of creation of PDF file about transaction for download.

    - The npm package of "connect-pg-simple" is necessary to be installed to replace "memorystore" for handling memory leakage as it stores session in PostreSQL Database so it is more suitable for production and scales better and persists session data across server restarts. As "pg" is required for connection pool, Knex configuration maybe set up again.

    - Error handling: too rely on "try-catch" which should be replaced by Promise.

    - Additional transaction date as a field added to sales table?

Notes:

1/  Under CSS folder, any relative path to retrieve target file starts from it's own working directory. For the path coded in JS file, it must start from the directory to which the corresponding HTML file belongs.

2/  Code snippet outside the async-await function does not take effect because of timing of code execution. For example, the code manipulating the DOM will execute before completion of fetch of data, null reference is then encountered. This snippet should be ensured to put in the sequence following the async function for which promise has resolved.


