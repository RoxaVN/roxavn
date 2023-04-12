export interface StorageHandler {
  name: string;
  defaultMaxSize: number;
  defaultMaxFileSize: number;
  upload(
    file: ReadableStream,
    size: number
  ): Promise<{ id: string; url: string; eTag: string }>;
  remove(fileId: string): Promise<void>;
}

export class StorageManager {
  private handlers: Array<StorageHandler> = [];

  add(handler: StorageHandler) {
    const exists = this.get(handler.name);
    if (exists) {
      throw new Error(`Handler ${handler.name} is existed`);
    }
    this.handlers.push(handler);
    return this;
  }

  get(name: string) {
    return this.handlers.find((handler) => handler.name === name);
  }

  getFirst() {
    const handler = this.handlers[0];
    return handler ? handler : undefined;
  }
}

export const storageManager = new StorageManager();
