import { TraitNameUnionOrString, TraitValueTypeUnion } from '../../../declarations/types';
import { iTraitCollectionDataStorage } from '../../data-storage/interfaces/data-storage-interfaces';
import { iTraitCollectionLogReporter } from '../../log/interfaces/log-interfaces';
import { iTraitCollection } from '../interfaces/trait-collection-interfaces';
import { iBaseTrait, iBaseTraitData, iTraitCollectionProps } from '../interfaces/trait-interfaces';

export default class TraitCollection<
  N extends TraitNameUnionOrString,
  V extends TraitValueTypeUnion,
  D extends iBaseTraitData<N, V>,
  T extends iBaseTrait<N, V, D>
> implements iTraitCollection<N, V, D, T> {
  protected dataStorage: iTraitCollectionDataStorage<N, V, D, T>;

  // #typeName: TraitTypeNameUnion | string = 'Trait Collection'; // ? is this required
  /** Read only log reporter */
  log: iTraitCollectionLogReporter;
  name: string;
  path: string;

  constructor(props: iTraitCollectionProps<N, V, D, T>, ...initialData: D[]) {
    const { name, traitCollectionDataStorageInitialiser } = props;
    this.name = name;

    // ? should this be async?
    this.dataStorage = traitCollectionDataStorageInitialiser({
      ...props,
      initialData,
      // onAdd: (props: iAddLogEventProps<V>) => this.logger.log(new AddLogEvent(props)), // todo delete? is this done in data storage now?
      // onDelete: (props: iDeleteLogEventProps<V>) => this.logger.log(new DeleteLogEvent(props)),
    });
    // expose logger reporter
    this.log = this.dataStorage.log;

    // ? will data storage be ready? i think setup is async
    // apply intial data
    initialData.forEach(({ name: currentName, value }) =>
      this.dataStorage.set(currentName, value)
    );

    this.path = this.dataStorage.path; // data storage defines path to use
  }

  get size(): number {
    return this.dataStorage.size;
  }

  cleanUp(): boolean {
    return this.dataStorage.cleanUp();
  }

  data(): D[] {
    return this.toArray().map((e) => e.data());
  }

  async delete(name: N): Promise<iTraitCollection<N, V, D, T>> {
    await this.dataStorage.delete(name);
    return this;
  }

  get(name: N): T | void {
    return this.dataStorage.get(name);
  }

  has(name: N): boolean {
    return this.dataStorage.has(name);
  }

  /**
   * Update trait value if it exists, otherwise add a new one
   * @param name name of trait to edit or create
   * @param newValue value to assign
   */
  async set(name: N, newValue: V): Promise<iTraitCollection<N, V, D, T>> {
    await this.dataStorage.set(name, newValue);
    return this;
  }

  toArray(): T[] {
    return this.dataStorage.toArray();
  }
}
