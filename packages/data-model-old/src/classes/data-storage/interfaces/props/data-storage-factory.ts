// -------------------------------------------------------
// DATA STORAGE FACTORY PROPS
// Note the props should be for initialising the data storage

import { iHasFirestore, iHasResolvedBasePath } from '../data-storage-interfaces';

export interface iBaseDataStorageFactoryProps {
	// logger: iCharacterSheetLogger | null;
}

export interface iInMemoryFileDataStorageFactoryProps extends iBaseDataStorageFactoryProps {}

export interface iLocalFileDataStorageFactoryProps extends iBaseDataStorageFactoryProps, iHasResolvedBasePath {}

export interface iFirestoreDataStorageFactoryProps extends iBaseDataStorageFactoryProps, iHasFirestore { }
