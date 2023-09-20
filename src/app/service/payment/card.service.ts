import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

interface Scripts {
  name: string;
  src: string;
}

export const ScriptStore: Scripts[] = [
  {name: 'square', src: environment._square}
];

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private scripts: any = {};
  constructor() {
    ScriptStore.forEach((script: any) => {
      this.scripts[script.name] = {
          loaded: false,
          src: script.src
      };
  });
  }
  loadScripts(...scripts: string[]): Promise<any> {
    const promises: any[] = [];
    scripts.forEach((script) => promises.push(this.loadScript(script)));
    return Promise.all(promises);
}

loadScript(name: string) {
  return new Promise((resolve, reject) => {
      if (!this.scripts[name].loaded) {
          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.src = this.scripts[name].src;
          // @ts-ignore
          if (script.readyState) {  // IE
              // @ts-ignore
              script.onreadystatechange = () => {
                  // @ts-ignore
                  if (script.readyState === 'loaded' || script.readyState === 'complete') {
                      // @ts-ignore
                      script.onreadystatechange = null;
                      this.scripts[name].loaded = true;
                      resolve({script: name, loaded: true, status: 'Loaded'});
                  }
              };
          } else {  // Others
              script.onload = () => {
                    this.scripts[name].loaded = true;
                  resolve({script: name, loaded: true, status: 'Loaded'});
              };
          }
          script.onerror = (error: any) => resolve({script: name, loaded: false, status: 'Loaded'});
          document.getElementsByTagName('head')[0].appendChild(script); // <--- !!!
      } else {
          resolve({script: name, loaded: true, status: 'Already Loaded'});
      }
  });
}

isAlreadyLoaded(name:any): boolean {
  return this.scripts[name]?.loaded;
}
}
