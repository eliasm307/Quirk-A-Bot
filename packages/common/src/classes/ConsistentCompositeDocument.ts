import { isRecord } from '../type-predicates';
import AbstractCompositeDocument, {
  AbstractCompositeDocumentLoaderProps, AbstractCompositeDocumentProps,
} from './AbstractCompositeDocument';

export interface ConsistentCompositeDocumentLoaderProps<K extends string, V>
  extends Omit<
    AbstractCompositeDocumentLoaderProps<Record<K, V>>,
    "documentSchemaPredicate"
  > {
  keyPredicate: (key: unknown) => key is K;
  valuePredicate: (value: unknown) => value is V;
}

export default class ConsistentCompositeDocument<
  K extends string,
  V
> extends AbstractCompositeDocument<Record<K, V>> {
  protected constructor(props: AbstractCompositeDocumentProps<Record<K, V>>) {
    super(props);
  }

  static load<K extends string, V>(
    props: ConsistentCompositeDocumentLoaderProps<K, V>
  ): AbstractCompositeDocument<Record<K, V>> {
    const { keyPredicate, valuePredicate } = props;

    // schema predicate for a consistent composite tests if keys and values match a given predicate
    const documentSchemaPredicate = (data: unknown): data is Record<K, V> =>
      isRecord(data, keyPredicate, valuePredicate);

    /*
    const { initialData } = await AbstractCompositeDocument.loadObserver({
      ...props,
      documentSchemaPredicate,
    });
    */

    return new ConsistentCompositeDocument({
      ...props,
      documentSchemaPredicate,
    });
  }
}
