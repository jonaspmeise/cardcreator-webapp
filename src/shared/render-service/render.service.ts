import { Injectable, OnInit } from '@angular/core';
import { WorkspaceService } from '../workspace-service/workspace.service';
import { EnvironmentService } from '../environment-service/environment.service';

@Injectable({
  providedIn: 'root'
})
export class RenderService {
  private regex = /##(?<jscode>.*?)##/gs;
  private svgCode!: string;
  private selectedCard!: any;
  private environment!: Map<string, string>;

  constructor(private workspaceService: WorkspaceService,
    private environmentService: EnvironmentService) { 
      this.workspaceService.selectedCard$.subscribe((card) => {
        this.selectedCard = card;
        this.updateSVG();
      });
  
      this.workspaceService.svgCode$.subscribe((svgCode) => {
        this.svgCode = svgCode;
        
        this.updateSVG();
      });
  
      this.environmentService.environment$.subscribe((environment) => {
        this.environment = environment;
      });
    }

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

  evaluateFunctions = (code: string, card = {}, environment?: Map<string, string>): string => {
    const functionDefinitions: string[] = [];

    let match;
    while (!!(match = this.regex.exec(code))) {
      functionDefinitions.push(match.groups!['jscode']);
    }
    
    if(!functionDefinitions) return code;

    functionDefinitions.forEach(definition => {
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

      const value = interpolationFunction.apply(null, args);
      code = code.replace(`##${definition}##`, value); //TODO: Change this according to the query regex
    });
    
    return code;
  }

  renderSvgXmlToBase64 = (svgCode: string): string => {
    return `data:image/svg+xml;base64,${btoa(
      svgCode
    )}`;
  }

  private updateSVG = () => {
    const afterFunctionCode = this.evaluateFunctions(this.svgCode, this.selectedCard, this.environment); 

    this.workspaceService.showImage(this.renderSvgXmlToBase64(afterFunctionCode));
  }
}
