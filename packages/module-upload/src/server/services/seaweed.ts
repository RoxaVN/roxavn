import FormData from 'form-data';
import http from 'http';
import qs from 'querystring';
import { Readable } from 'stream';

import { Env } from '../config';

export class SeaweedClient {
  constructor(private baseUrl: string) {}

  private _resolveResponse(
    resp: http.IncomingMessage,
    resolve: (result: any) => void
  ) {
    let body = '';
    resp.setEncoding('utf8');
    resp.on('data', function (chunk) {
      body += chunk;
    });
    resp.on('end', function () {
      return resolve(JSON.parse(body));
    });
  }

  assign(params?: any): Promise<{
    count: number;
    fid: string;
    publicUrl: string;
    url: string;
    error?: string;
  }> {
    return new Promise((resolve, reject) => {
      http
        .request(
          new URL('dir/assign?' + qs.stringify(params), this.baseUrl),
          (resp) => {
            this._resolveResponse(resp, resolve);
          }
        )
        .on('error', function (err) {
          return reject(err);
        })
        .end();
    });
  }

  write(
    file: Readable,
    params?: any
  ): Promise<{
    size: number;
    eTag: string;
    error?: string;
  }> {
    return this.assign(params).then((finfo) => {
      return new Promise((resolve, reject) => {
        const form = new FormData();
        form.append('file', file);
        const volumeUrl = Env.SEAWEED_USE_PUBLIC_URL
          ? finfo.publicUrl
          : finfo.url;

        const urlParts = new URL(
          finfo.fid,
          volumeUrl.startsWith('http') ? volumeUrl : `http://${volumeUrl}`
        );

        const request = http.request({
          method: 'post',
          headers: form.getHeaders(),
          hostname: urlParts.hostname,
          port: urlParts.port,
          pathname: urlParts.pathname,
          path: urlParts.pathname,
        });
        form.pipe(request);

        request
          .on('response', (resp) => {
            this._resolveResponse(resp, resolve);
          })
          .on('error', function (err) {
            reject(err);
          });
      });
    });
  }
}

export const seaweedClient = new SeaweedClient(Env.SEAWEED_MASTER_URL);
