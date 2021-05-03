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

  async load<S extends Record<string, any>>(
    props: InconsistentCompositeDocumentLoaderProps<S>
  ): Promise<AbstractCompositeDocument<S>> {
    const { valuePredicates, initialData } = props;

    const schemaPredicate = (data: any): data is S => {
      if (typeof data !== "object") return false;

      for (const [key, value] of Object.entries(data)) {
        const valuePredicate = valuePredicates[key];

        // if no predicate exists, then it means key is invalid
        if (!valuePredicate) {
          console.warn(__filename, `key "${key}" does not meet predicate`);
          return false;
        }
        // test value
        if (!valuePredicate(value)) {
          console.warn(
            __filename,
            `value for key "${key}" does not meet predicate`,
            { key, value }
          );
          return false;
        }
      }
      return true;
    };

    return new ConsistentCompositeDocument({
      ...props,
      initialData,
      schemaPredicate,
    });
  }
}
