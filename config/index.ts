const {NODE_ENV} = process.env;

let config: any = null;

if (NODE_ENV === 'development') 
  config = require('./development').default;

if (NODE_ENV === 'test') 
  config = require('./testing').default;

if (NODE_ENV === 'production') 
  config = require('./production').default;

export default config;