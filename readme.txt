Notes:

1/  Under CSS folder, any relative path to retrieve target file starts from it's own working directory. For the path coded in JS file, it must start from the directory to which the corresponding HTML file belongs.

2/  Code snippet outside the async-await function does not take effect because of timing of code execution. For example, the code manipulating the DOM will execute before completion of fetch of data, null reference is then encountered. This snippet should be ensured to put in the sequence following the async function for which promise has resolved.

3/  For the sake of security, the password should be hashed in frontend before sending to backend. It is because the password is sent in plain text to server, and then hashed by bcrypt. If the password is hashed in frontend, the plain text password will not be sent to server. However, the hashed password will be sent to server. It is still secure because the hashed password is not reversible.

    But some argued that it is not best practise because of lack of Salt Management.

