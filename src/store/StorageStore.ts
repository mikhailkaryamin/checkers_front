import { LocalStorageService } from 'src/shared/classes/LocalStorageService';
import { MatchResult } from "src/types";

type Result = {
  date: string;
  result: MatchResult
}

type DefaultLocalStorageData = {
  results: Result[];
}

const defaultLocalStorageData: DefaultLocalStorageData = {
  results: []
}

export class StorageStore {
  protected readonly localStorageService = new LocalStorageService(defaultLocalStorageData);

  public get matchResults() {
    return this.localStorageService.data.results;
  }

  public setResult(result: Result) {
    const prevResults = this.localStorageService.data.results;
    const newResults = [...prevResults, result];
    this.localStorageService.update({ results: newResults })
  }
}
