import { Injectable, OnInit } from '@angular/core';
import { WorkspaceService } from '../workspace-service/workspace.service';

@Injectable({
  providedIn: 'root'
})
export class RenderService {
  private regex = /##(?<jscode>.*)##/gs;

  constructor() { }

  //FIXME: This is ineffective because we re-built our parsing functions for every iteration;
  // better: build the functions once, then iterate over all elements 
  // todo: how to discern between elements that should be injected "each time" and "iterating data"?
  // ===> just force them, since we only have 2 arguments (card / environment) anyhow?
  private getFunctionArguments = (func: Function): string[] => {
    const funcString = func.toString();
    const argList = funcString.match(/\((.*?)\)/);

    if(!argList) return [];
    
    return argList[1].split(',')
      .map(arg => arg.trim())
      .filter(str => str.length > 0);
  }

  evaluateFunctions = (code: string, card = {}, environment = {}): string => {
    console.log('evaluate with card', card);
    const functionDefinitions: string[] = [];

    let match;
    while (!!(match = this.regex.exec(code))) {
      functionDefinitions.push(match.groups!['jscode']);
    }
    
    if(!functionDefinitions) return code;

    functionDefinitions.forEach(definition => {
      console.log('evaluation definition...', definition);
      const interpolationFunction: Function = eval(definition);
      const interpolationArguments = this.getFunctionArguments(interpolationFunction);

      const args: any[] = interpolationArguments.map(arg => {
        if(arg === 'card') {
          return card;
        } else if(arg ==='environment') {
          return environment;
        } else {
          throw Error(`I don't know this function parameter: ${arg}`);
        }
      });

      console.log('Calling with arguments...', args);

      const value = interpolationFunction.apply(null, args);
      console.log('value', value);
      code = code.replace(`##${definition}##`, value); //TODO: Change this according to the query regex
    });
    
    console.log('SVG-Code after: ', code);
    return code;
  }
}
