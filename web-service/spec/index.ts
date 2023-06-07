import dotenv from 'dotenv';
import chai from 'chai';

dotenv.config({ path: './../.env' });

import chaiHttp from 'chai-http';
import server from '../app/server';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);
chai.use(chaiHttp);

const client = chai.request(server).keepOpen();
export default client;