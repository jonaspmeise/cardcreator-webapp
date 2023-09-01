import { Component, OnInit } from '@angular/core';
import { EnvironmentService } from 'src/shared/environment-service/environment.service';

@Component({
  selector: 'app-environment',
  templateUrl: './environment.component.html',
  styleUrls: ['./environment.component.css']
})
export class EnvironmentComponent implements OnInit {
  variables: Map<string, string> = new Map<string, string>();

  constructor(private environmentService: EnvironmentService) {}

  ngOnInit(): void {
    this.environmentService.environmentVariables$.subscribe((variables) => {
      this.variables = variables;
    });
  }

  onChangeKey = (event: any, entry: {key: string, value: string}) => {
    this.environmentService.changeEnvironmentValue(entry.key, event.target.value);
  }

  onChangeValue = (event: any, entry: {key: string, value: string}) => {
    this.environmentService.changeEnvironmentKey(entry.key, event.target.value);
  }
}
