export class BaseService {
  protected readonly baseUrlAPI = 'https://zwvista.com/lolly/api.php/records/';
  protected readonly baseUrlSP = 'https://zwvista.com/lolly/sp.php/';

  async httpGet<T>(url: string): Promise<T> {
    console.log(`[RestApi]GET:${url}`);
    const result = await fetch(url);
    const data = await result.json();
    return data as T;
  }

  async httpPost<T>(url: string, body: any | null): Promise<T> {
    console.log(`[RestApi]POST:${url} BODY:${body}`);
    const result = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data = await result.json();
    return data as T;
  }

  async httpPut<T>(url: string, body: any | null): Promise<T> {
    console.log(`[RestApi]PUT:${url} BODY:${body}`);
    const result = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });
    const data = await result.json();
    return data as T;
  }

  async httpDelete(url: string): Promise<number> {
    console.log(`[RestApi]DELETE:${url}`);
    const result = await fetch(url, {
      method: 'DELETE',
    });
    const data = await result.text();
    return +data;
  }
}
