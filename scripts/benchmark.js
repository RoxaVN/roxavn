const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://admin:admin@localhost:5432/roxavn',
});

async function vote() {
  await pool.query(`
    UPDATE message
    SET metadata = jsonb_set(
    metadata,
    '{poll,options,1,count}',
    to_jsonb(COALESCE((metadata->'poll'->'options'->1->>'count')::int, 0) + 1),
    true
    )
    WHERE id = '10'
  `);
}

async function main() {
  console.time('Voting benchmark');
  await Promise.all(Array.from({ length: 10000 }, vote)).then(() => {
    pool.end();
  });
  console.timeEnd('Voting benchmark');
}

main();
