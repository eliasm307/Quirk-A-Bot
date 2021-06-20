import { FireBaseUser } from 'packages/common/dist/src/FirebaseExports';
import { Observable } from 'rxjs';

import {
  auth, DEFAULT_CHARACTER_IMAGE_URL, DEFAULT_USER_NAME, FirestoreCollectionReference,
  FirestoreQuery,
} from '@quirk-a-bot/common';

import { iUserData } from '../../classes/user/interfaces';

interface Props<D> {
  dataPredicate(value: unknown): value is D;
}

// ? does this need to be generic?

// todo test

export default function observableFromFirebaseAuthUser<
  D extends iUserData = iUserData
>({ dataPredicate }: Props<D>): Observable<D | undefined> {
  return new Observable<D>((observer) => {
    auth.onAuthStateChanged({
      complete: observer.complete,
      error: observer.error,
      next: (user?: FireBaseUser) => {
        if (!user) return observer.next(undefined);

        const data: iUserData = {
          displayName: user.displayName || DEFAULT_USER_NAME,
          id: user.uid,
          photoURL: user.photoURL || DEFAULT_CHARACTER_IMAGE_URL,
        };

        if (!dataPredicate(data))
          throw Error(`User data does not match predicate`);

        observer.next(data);
      },
    });
  });
}
