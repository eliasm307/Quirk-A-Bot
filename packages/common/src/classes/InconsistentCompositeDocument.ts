import { isRecord } from '../type-predicates';
import AbstractCompositeDocument, {
  AbstractCompositeDocumentLoaderProps, AbstractCompositeDocumentProps,
} from './AbstractCompositeDocument';

export interface InconsistentCompositeDocumentLoaderProps<
  S extends Record<string, any>
> extends Omit<AbstractCompositeDocumentLoaderProps<S>, "schemaPredicate"> {
  valuePredicates: Record<keyof S, (value: any) => value is S[keyof S]>;
}

export default class ConsistentCompositeDocument<
  S extends Record<string, any>
> extends AbstractCompositeDocument<S> {
  protected constructor(props: AbstractCompositeDocumentProps<S>) {
    super(props);
  }

  static async load<S extends Record<string, any>>(
    props: InconsistentCompositeDocumentLoaderProps<S>
  ): Promise<AbstractCompositeDocument<S>> {
    const { valuePredicates } = props;

    // schema predicate for a consistent composite tests if keys and values match a given predicate
    const schemaPredicate = (data: any): data is S => {
      isRecord(data, keyPredicate, valuePredicate);
    };

    const { initialData } = await AbstractCompositeDocument.loadObserver({
      ...props,
      schemaPredicate,
    });

    return new ConsistentCompositeDocument({
      ...props,
      initialData,
      schemaPredicate,
    });
  }
}
