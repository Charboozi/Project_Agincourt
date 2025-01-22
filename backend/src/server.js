//Start server
const app = require('./app');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Schedule resource generation every minute
const cron = require('node-cron');
const pool = require('./config/db');

cron.schedule('*/10 * * * *', async () => {
    try {
        const buildings = await pool.query(`
            SELECT b.castle_id, b.production, b.farm, c.material, c.food
            FROM buildings b
            JOIN castles c ON b.castle_id = c.id
        `);

        for (const row of buildings.rows) {
            const materialIncrease = row.production * 10; //material per production building
            const foodIncrease = row.farm * 10;       //food per farm building

            await pool.query(
                `UPDATE castles
                 SET material = material + $1, food = food + $2
                 WHERE id = $3`,
                [materialIncrease, foodIncrease, row.castle_id]
            );

            console.log(
                `Generated ${materialIncrease} material and ${foodIncrease} food for castle ${row.castle_id}`
            );
        }
    } catch (error) {
        console.error('Error generating resources:', error.message);
    }
});