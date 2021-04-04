describe("data model for trait group documents", () => {
  it("can read and write entire trait groups to/from firestore", async () => {
    expect.hasAssertions();
  });
  it("can initialise using existing data on firestore", async () => {
    expect.hasAssertions();
  });
  it("logs changes", async () => {
    expect.hasAssertions();
  });
  it("doesnt accept data that doesnt match a given schema", async () => {
    expect.hasAssertions();
  });
  it("can change single traits on firestore", async () => {
    expect.hasAssertions();
  });
  it("handles remote changes to single traits on firestore", async () => {
    expect.hasAssertions();
  });
  it("can read and write trait groups with different object schemas on firestore", async () => {
    expect.hasAssertions();
  });
  it("can read and write object traits in an array on firestore", async () => {
    expect.hasAssertions();
  });
  it("handles firebase errors when operation is not permitted by rules", async () => {
    expect.hasAssertions();
  });
});

describe("data model for character sheet", () => {
  it("can only instantiate one local singleton of a charactersheet with a certain id", async () => {
    expect.hasAssertions();
  });
  it("can initialise a new character sheet from blank with default data to firestore", async () => {
    expect.hasAssertions();
  });
  it("can initialise an existing character sheet from data in firestore", async () => {
    expect.hasAssertions();
  });
  it("handles firebase errors when operation is not permitted by rules", async () => {
    expect.hasAssertions();
  });
});

describe("data model for game core details", () => {
  it("can only instantiate one local singleton of a game with a certain id", async () => {
    expect.hasAssertions();
    // at times multiple games might need to be shown in a list so caching them would be good
  });
  it("can initialise a new game from blank with default data to firestore", async () => {
    expect.hasAssertions();
  });
  it("can list all requests received to join the game and their result/status", async () => {
    expect.hasAssertions();
    // todo add requests collection to firestore game
  });
  it("can initialise an existing game from data in firestore", async () => {
    expect.hasAssertions();
  });
  it("can accept player requests and initialise them", async () => {
    expect.hasAssertions();
    // assert character sheet is initialised
  });
  it("can reject player requests and provide reason", async () => {
    expect.hasAssertions();
    // assert status is updated
  });
  it("can remove players and provide reason", async () => {
    expect.hasAssertions();
    // assert status is updated
  });
  it("can list active players in a game", async () => {
    expect.hasAssertions();
  });
  it("can list active GMs in a game", async () => {
    expect.hasAssertions();
  });
  it("doesnt allow a game to not have atleast 1 GM", async () => {
    expect.hasAssertions();
  });
  it("handles firebase errors when operation is not permitted by rules", async () => {
    expect.hasAssertions();
  });
  it("can produce a game character sheet manager instance on request", async () => {
    expect.hasAssertions();
  });
});

describe("data model for game character sheet manager", () => {
  it("can only instantiate one local singleton of a game with a certain id", async () => {
    expect.hasAssertions();
    // there will only be one game character sheet manager required for the game screen so this is low priority
  });
  it("can initialise a new game from blank with default data to firestore", async () => {
    expect.hasAssertions();
  });
  it("can initialise an existing game from data in firestore", async () => {
    expect.hasAssertions();
  });

  it("handles firebase errors when operation is not permitted by rules", async () => {
    expect.hasAssertions();
  });
});

describe("data model for user", () => {
  it("can only instantiate one local singleton of a user with a certain id", async () => {
    expect.hasAssertions();
  });
  it("handles firebase errors when operation is not permitted by rules", async () => {
    expect.hasAssertions();
  });

  it("can initialise a new user from blank with default data to firestore", async () => {
    expect.hasAssertions();
  });
  it("can initialise an existing user from data in firestore", async () => {
    expect.hasAssertions();
  });
  it("allows players to request to join a game by id", async () => {
    expect.hasAssertions();
  });
  it("can list all games the user is part of/ requesting to join etc", async () => {
    expect.hasAssertions();
  });
  it("auto-updates when the status of a user in a game changes", async () => {
    expect.hasAssertions();
    // todo add firestore function to handle this? or include this as an action when updating details in a game
  });
  it("allows user to leave games / delete requests", async () => {
    expect.hasAssertions();
  });
});
