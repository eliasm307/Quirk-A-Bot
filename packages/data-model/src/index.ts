import FirestoreCompositeModelFactory from './classes/data-models/firestore-composite/ModelFactory';
import ViewModelFactory from './classes/view-models/ViewModelFactory';

// console.warn(__filename, 'init');

// todo define exports which include protection based on the signed in user, ie a user can only access games or character sheets they have access to

// todo refactor code to be organised by domain models

// eslint-disable-next-line import/prefer-default-export
export const viewModelFactory = new ViewModelFactory(
  new FirestoreCompositeModelFactory()
);
