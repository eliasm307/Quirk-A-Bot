export default function firestoreIdIsValid(id: string) {
  // id should only contain alpha numeric characters, ie not contain anything below
  return /\W_/.test(id) === false;
}
