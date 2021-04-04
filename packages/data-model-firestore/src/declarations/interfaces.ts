type DocumentChangeHandler<D> = (newData: D) => void;

// attaches a listener to a firestore document
export interface iDocumentListener<D> {
  onChange: (handler: DocumentChangeHandler<D>) => void;
  stop: () => void;
}

export int
