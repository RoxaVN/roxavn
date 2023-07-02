import { urlUtils } from '@roxavn/core/base';
import FormData from 'form-data';
import { ReadStream } from 'fs';

const cacheLookup: Record<string, any> = {};

export class SeaweedFSClient {
  constructor(private masterUrl: string) {}

  private _urlWithSchema = (url: string): string =>
    url.startsWith('http') ? url : `http://${url}`;

  async lookup(params: { volumeId: number | string }): Promise<{
    locations: Array<{ publicUrl: string; url: string }>;
  }> {
    if (params.volumeId in cacheLookup) {
      return cacheLookup[params.volumeId];
    }
    const result = await fetch(
      new URL('dir/lookup?' + urlUtils.generateQueryStr(params), this.masterUrl)
    ).then((resp) => resp.json());
    cacheLookup[params.volumeId] = result;
    return result;
  }

  assign(params?: Record<string, any>): Promise<{
    count: number;
    fid: string;
    publicUrl: string;
    url: string;
    error?: string;
  }> {
    return fetch(
      new URL(
        'dir/assign?' + urlUtils.generateQueryStr(params || {}),
        this.masterUrl
      )
    ).then((resp) => resp.json());
  }

  async write(file: ReadStream): Promise<{
    id: string;
    url: string;
    size: number;
    eTag: string;
  }> {
    const finfo = await this.assign();
    const form = new FormData();
    form.append('file', file);

    const result = await fetch(
      new URL(finfo.fid, this._urlWithSchema(finfo.url)),
      {
        method: 'POST',
        body: form as any,
      }
    ).then((resp) => resp.json());
    result.id = finfo.fid;
    result.url = new URL(finfo.fid, finfo.publicUrl).toString();

    return result;
  }

  async delete(fid: string): Promise<{ success: boolean }> {
    const result = await fetch(new URL(fid, this.masterUrl), {
      method: 'delete',
    }).then((resp) => resp.json());
    return { success: result.size > 0 };
  }
}
