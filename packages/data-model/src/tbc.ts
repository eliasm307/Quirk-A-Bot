// todo this shouldn't be part of the UserViewModel, users can only be created from signing up
/*
  protected static async newUser({
    uid,
    firestore,
    data,
  }: iLoadProps & {
    data: Partial<Omit<iUserData, "uid">>;
  }): Promise<UserViewModel> {
    const userData: iUserData = {
      ...defaultUserData(uid),
      ...data,
    };

    try {
      // init user on firestore
      await firestore.collection(USER_COLLECTION_NAME).doc(uid).set(userData);
    } catch (error) {
      console.error({ error });
      throw Error(`Error initialising user with uid ${uid}`);
    }
    return new UserViewModel(userData);
  }
  */

export {};
