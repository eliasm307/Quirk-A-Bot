import { iBaseDataStorage } from './../../declarations/interfaces/data-storage-interfaces';
export default abstract class AbstractDataStorage implements iBaseDataStorage {
  abstract save(): void  
}
