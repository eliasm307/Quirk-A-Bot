import { Firestore } from '@quirk-a-bot/firebase-utils';

import { iHasPath } from '../../../../declarations/interfaces';
import { iHasFirestore, iHasId } from '../../interfaces/data-storage-interfaces';

// todo move to firestore utils

interface Props<D> extends iHasFirestore, iHasPath {
  /** A function which returns a promise that resolves a Firestore document into the required data format  */
  documentDataReader(props: DocumentDataReaderProps): Promise<D>;
  /** A function which writes custom data to a firestore document and or sub collections in the correct manner  */
  documentDataWriter(props: DocumentDataWriterProps<D>): Promise<void>;
  /** A function to produce default data to use if the document doesnt exist */
  newDefaultData(): D;
}

export interface DocumentDataReaderProps {
  firestore: Firestore;
  path: string;
}

export interface DocumentDataWriterProps<D> extends DocumentDataReaderProps {
  data: D;
}

export default async function assertDocumentExistsOnFirestore<D>({
  firestore,
  documentDataReader,
  documentDataWriter,
  path,
  newDefaultData: defaultData,
}: Props<D>): Promise<D> {
  const docPromise = firestore.doc(path).get();
  const docDataPromise = documentDataReader({ firestore, path });

  try {
    const [doc, docData] = await Promise.all([docPromise, docDataPromise]);

    if (!doc.exists)
      throw Error(
        `Document at path ${path} does not exist, initialising it now`
      );
    return docData; // return the found data of the existing document
  } catch (error) {
    console.warn(
      `Could not read character sheet data from path ${path}, initialising a new character sheet...`,
      { error }
    );
    // if it doesnt exist or data is bad, initialise it as a blank character sheet if not
    try {
      const data = defaultData(); // use default data and save data locally

      await documentDataWriter({ firestore, path, data });

      return data;
    } catch (error) {
      console.error(__filename, { error });
      throw Error(`Could not initialise a new character sheet at path ${path}`);
    }
  }
}
