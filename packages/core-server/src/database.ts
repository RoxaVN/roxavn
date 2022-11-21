import { DataSource, DataSourceOptions } from 'typeorm';

class DatabaseManager {
  dataSource!: DataSource;

  createSource(options: DataSourceOptions) {
    this.dataSource = new DataSource(options);
  }
}

export default new DatabaseManager();
