const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Include the routes
const authRoutes = require('./routes/authRoutes');
app.use('/api', authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
