import { Observable } from 'rxjs';

import { CHARACTER_COLLECTION_NAME, firestore, iHasId, iHasParentPath } from '@quirk-a-bot/common';

import { iCharacterSheetData, iGameData } from '../../../declarations/interfaces';
import observableFromFirestoreCollection from '../../../utils/observables/observableFromFirestoreCollection';
import { isCharacterSheetData } from '../../../utils/type-predicates';
import isGameData from '../../../utils/type-predicates/isGameData';
import { iGameModelReader } from '../interfaces';
import AbstractDocumentReader from './AbstractDocumentReader';
import FirestoreCompositeModelUtils from './ModelUtils';

interface Props extends iHasId, iHasParentPath {}

// todo test

export default class GameFirestoreCompositeModelReader
  extends AbstractDocumentReader<iGameData>
  implements iGameModelReader
{
  characterCollectionData$: Observable<iCharacterSheetData[]>;

  constructor(props: Props) {
    super({ ...props, dataPredicate: isGameData });

    const utils = new FirestoreCompositeModelUtils();

    const characterCollectionPath = utils.createPath(
      this.path,
      CHARACTER_COLLECTION_NAME
    );

    this.characterCollectionData$ = observableFromFirestoreCollection({
      firestoreCollectionRef: firestore.collection(characterCollectionPath),
      dataPredicate: isCharacterSheetData,
    });
  }
}
