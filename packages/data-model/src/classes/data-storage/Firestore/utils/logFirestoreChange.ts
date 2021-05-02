import { FirestoreDocumentChange } from '@quirk-a-bot/common';

export default function logFirestoreChange(
  change: FirestoreDocumentChange,
  consoleFunction: (...args: any) => void
) {
  return consoleFunction("document change", {
    type: change.type,
    docId: change.doc.id,
    doc: change.doc.data(),
  });
}
