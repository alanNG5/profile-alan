Hashed password

Using "Invalid password or username." as an error message got from POST of login is better than separation of messages of "Username not found." and "Invalid password.", based on consideration for security of user account.

Based on MVP

Improvement plan:
    - Database Transaction: When sales is triggered, quantity of product in stock should be deducted. Another error handling is necessary as SQL query for UPDATE and INSERT are involved.

Contraints applied to different users.

Additional transaction date as a field added to sales table.