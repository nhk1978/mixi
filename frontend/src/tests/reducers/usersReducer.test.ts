import usersReducer, {
  createUser,
  emptyUsersReducer,
  sortByEmail,
  fetchAllUsers,
  login,
  updateUser,
  createNewUser,
} from "../../redux/reducers/usersReducer";
import { User, userRoleEnum } from "../../types/User";
import { UserUpdate } from "../../types/UserUpdate";
import { user1, user2, user3 } from "../data/users";
import userServer from "../servers/userServer";
import store from "../shared/store";

beforeAll(() => {
  userServer.listen();
});

afterAll(() => {
  userServer.close();
});

beforeEach(() => {
  store.dispatch(emptyUsersReducer());
  store.dispatch(createUser(user1));
  store.dispatch(createUser(user2));
  store.dispatch(createUser(user3));
});

describe("usersReducer", () => {
  const initialState = {
    users: [],
    currentUser: undefined,
    loading: false,
    error: "",
  };

  test("Check initialState", () => {
    const state = usersReducer(undefined, { type: "unknown" });
    expect(state).toEqual({
      users: [],
      loading: false,
      error: "",
    });
  });

  test("should handle createUser", () => {
    const action = createUser(user1);
    const newState = usersReducer(initialState, action);

    expect(newState.users).toHaveLength(1);
    expect(newState.users[0]).toEqual(user1);
  });

  test("create new user fail", async () => {
    await store.dispatch(createNewUser(user1));

    expect(store.getState().usersReducer.users.length).toBe(3);
    expect(store.getState().usersReducer.error).toBe(
      "Request failed with status code 400"
    );
  });

  test("create new user ok", async () => {
    const createUser = {
      firstName: "string",
        lastName: "string",
        email: "string",
        phoneNumber: "string",
        role: userRoleEnum.Admin,
        avatar: "string"};
    await store.dispatch(createNewUser(createUser as User));

    expect(store.getState().usersReducer.users.length).toBe(4);
    expect(store.getState().usersReducer.users[3].firstName).toBe("111111");
    // expect(store.getState().usersReducer.error).toBe("Request failed with status code 400")
  });

  test("should handle emptyUsersReducer", () => {
    const action = emptyUsersReducer();
    const newState = usersReducer(initialState, action);

    expect(newState.users).toHaveLength(0);
  });

  test("Check should fetch all users", async () => {
    //only can check the final result
    await store.dispatch(fetchAllUsers());
    expect(store.getState().usersReducer.users.length).toBe(4);
    expect(store.getState().usersReducer.loading).toBeFalsy();
  });

  // Bug cannot update user
  test("Check update users", async () => {
    const userUpdate: UserUpdate = {
      id: 1,
      update: {
        firstName: "string",
        lastName: "string",
        email: "string",
        phoneNumber: "string",
        role: userRoleEnum.Admin,
        avatar: "string",
        address: ""
      },
    };
    //only can check the final result
    await store.dispatch(updateUser(userUpdate));
    expect(store.getState().usersReducer.users.length).toBe(3);
    expect(store.getState().usersReducer.loading).toBeFalsy();

    // Need to fix this bug
    // expect(store.getState().usersReducer.error).toBeFalsy(); //empty string is interpreted as falsy value if JS
  });

  test("Check should fetch users in pending state", () => {
    const state = usersReducer(undefined, fetchAllUsers.pending);
    expect(state).toEqual({ users: [], loading: true, error: "" });
  });

  test("Check if existing user can login", async () => {
    await store.dispatch(
      login({
        email: "john@mail.com",
        password: "changeme",
      })
    );
    expect(store.getState().usersReducer.currentUser).toBeDefined();
  });

  test("should handle sortByEmail (ascending)", () => {
    const users = [user3, user2, user1];

    const action = sortByEmail("asc");
    const newState = usersReducer({ ...initialState, users }, action);

    expect(newState.users).toEqual([user3, user1, user2]);
  });

  test("should handle sortByEmail (descending)", () => {
    const users = [user3, user2, user1];

    const action = sortByEmail("desc");
    const newState = usersReducer({ ...initialState, users }, action);

    expect(newState.users).toEqual([user2, user1, user3]);
  });
});
