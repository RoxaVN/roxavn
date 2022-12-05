import database from './database';

export default async function install(): Promise<any> {
  try {
    // only use for demo, should move it to cli or some place to run migration
    // in better way
    await database.up();
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(1);
  }
}

install();
