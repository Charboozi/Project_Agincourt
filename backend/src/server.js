//Start server
const app = require('./app');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Schedule resource generation every minute
const cron = require('node-cron');
const pool = require('./config/db');

cron.schedule('* * * * * *', async () => {
    try {
        const buildings = await pool.query(`
            SELECT b.kingdom_id, b.production, b.farm, k.material, k.food
            FROM buildings b
            JOIN kingdoms k ON b.kingdom_id = k.id
        `);

        for (const row of buildings.rows) {
            const materialIncrease = row.production * 10; //material per production building
            const foodIncrease = row.farm * 10;       //food per farm building

            await pool.query(
                `UPDATE kingdoms
                 SET material = material + $1, food = food + $2
                 WHERE id = $3`,
                [materialIncrease, foodIncrease, row.kingdom_id]
            );

            console.log(
                `Generated ${materialIncrease} material and ${foodIncrease} food for kingdom ${row.kingdom_id}`
            );
        }
    } catch (error) {
        console.error('Error generating resources:', error.message);
    }
});
