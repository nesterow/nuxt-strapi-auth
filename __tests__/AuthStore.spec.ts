import Vuex from 'vuex'
import {createLocalVue} from '@vue/test-utils'
import {getModule} from 'vuex-module-decorators'
import AuthStore from '../store'
import {MongoClient} from 'mongodb' 

import {ApiError} from '../types';

const mongoUrl = process.env.MONGODB_URL || 'mongodb://root:rootpassword@localhost:27017';

const takenAccount = {
  "confirmed": true,
  "blocked": false,
  "username": "John Doe",
  "email": "test@test.com",
  "password": "$2a$10$R1FwnXw8hXKwFsTi4hNLK.bEfnvFozb2M1LohK1anAtTOzqrSk0Vi", // generate using your secret
  "provider": "local",
  "createdAt": new Date(),
  "updatedAt": new Date(),
};

const newAccount = {
  "username": "Registered Account", 
  "email": "qweqwe@test.com",
  "password" : 'test123123'
};

const factory = () => {
  const Vue = createLocalVue();
  Vue.use(Vuex);
  const store = new Vuex.Store({
    modules: { auth: AuthStore }
  });
  return getModule(AuthStore, store);
};

describe('AuthStore', () => {
  let db: any;
  beforeAll((done) => {
    const mongo = new MongoClient(mongoUrl, { useUnifiedTopology: true });
    mongo.connect(async (err) => {
      if(err) throw err;
      db = mongo.db('content')
      await new Promise((resolve) => db.collection('users-permissions_user').deleteMany({
        "username": "John Doe", 
        "email": "test@test.com",
      }, resolve));
      db.collection('users-permissions_user').insertOne(takenAccount, done);
    })
  });
  afterAll((done) => {
    db.collection('users-permissions_user').deleteMany({
      "username": takenAccount.username,
      "email": takenAccount.email,
    });
    db.collection('users-permissions_user').deleteMany({email: newAccount.email}, done);
  });
  it('initializes', async (done) => {
    const service = factory()
    expect(service).toBeInstanceOf(Object)
    done()
  });
  it('register(): 400 email taken', async () => {
    const service = factory()
    await service.register({
      email: 'test@test.com',
      password: 'test1234',
      username: 'John Doe'
    });
    const error = service.error as ApiError
    expect(error).toBeInstanceOf(Object)
    expect(service.errorMessages).toContain('Email is already taken.')
  });
  it('register(): 200 success', async () => {
    const service = factory();
    await service.register(newAccount)
    expect(service.error).toBe(false)
    expect(service.user).toBeInstanceOf(Object)
    expect(service.user.email).toEqual(newAccount.email)
    expect(!!service.cookies.jwt).toBe(true)
  });
  it('login(): 400 no user', async () => {
    const service = factory()
    await service.login({identifier: 'non-existent@test.com', password: 'test123' })
    const error = service.error as ApiError;
    expect(service.errorMessages![0]).toContain('Identifier')
    expect(service.errorMessages![0]).toContain('password')
    expect(error.statusCode).toBe(400)
  });
  it('login(): 200  / getProfile(): 200', async () => {
    const service = factory()
    await service.login({identifier: newAccount.email, password: newAccount.password })
    expect(service.user.email).toEqual(newAccount.email)
    expect(!!service.cookies.jwt).toBe(true)
    await service.getProfile()
  });

})
