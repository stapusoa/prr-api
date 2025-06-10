const express = require('express');
const app = express();
app.get('/', (_, res) => res.send('API is working!'));
app.listen(3000, () => console.log('Server running on port 3000'));
