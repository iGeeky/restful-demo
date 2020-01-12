const Koa = require('koa')
const json = require('koa-json')
const cors = require('koa2-cors')
const staticServer = require('koa-static')
const bodyparser = require('koa-bodyparser')
const Router = require('koa-router')
const store = require('./store')
const path = require('path')
const randomWords = require('random-words');

const app = new Koa()
const router = new Router();

function doAdd(model, requestBody) {
  return store.add(model, requestBody)
}

function doUpdate(model, requestBody) {
  return store.update(model, requestBody)
}

function doDelete(model, requestBody) {
  return store.deleteByID(model, requestBody.id);
}

function doGet(model, requestBody) {
  return store.getByID(model, requestBody.id);
}

function doList(model, requestBody) {
  const query = Object.assign({}, requestBody)
  const page = query.page || 1;
  const limit = query.limit || 10;
  delete(query.page);
  delete(query.limit);
  return store.list(model, query, page, limit)
}

const models = {application: true, user: true, role: true, permission: true, resource: true, log: true}

// reset and init data.
function initData() {
  console.log('------------- reset the data ---------------')
  store.reset();
  const keys = Object.keys(models)
  keys.forEach(model => {
    for(let i=1;i <= 24; i++) {
      const name = randomWords({exactly: 2, join: '-'});
      const description = randomWords({min: 3, max: 5, join: ' '})
      const value = {name: `${model}-${name}`, description: `${model}: ${description}`}
      store.add(model, value);
    }
  });
}

initData();
setInterval(() => {
  initData();
}, 3600*1000);


router.all(('/api/:model'), async (ctx, next) => {
  const model = ctx.params.model;
  let method = ctx.request.method
  console.info('model: %s method [%s]', model, method)
  const ok = models[model]
  if(!ok) {
    ctx.status = 400;
    ctx.body = {ok: false, reason: 'model invalid'}
    return
  }

  let response = null;
  switch(method) {
  case 'POST': response = doAdd(model, ctx.request.body)
  break;
  case 'PUT': response = doUpdate(model, ctx.request.body)
  break;
  case 'DELETE': response = doDelete(model, ctx.request.body)
  break;
  case 'GET': response = doGet(model, ctx.query)
  break;
  default:
    console.error('unknown method: %s', method)
  }

  ctx.status = 200;
  ctx.body = {ok: true, reason: '', data: response}
})


router.all(('/api/:model/list'), async (ctx, next) => {
  const model = ctx.params.model;
  console.info('model: %s method [list]', model)
  const ok = models[model]
  if(!ok) {
    ctx.status = 400;
    ctx.body = {ok: false, reason: 'model invalid'}
    return
  }

  let response = doList(model, ctx.query)
  ctx.status = 200;
  ctx.body = {ok: true, reason: '', data: response}
})

try {
  app.use(cors({
    origin: (ctx) => {
      return '*'
    },
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
  }))
  app.use(json())
  app.use(bodyparser())
  app.use(staticServer(path.join(__dirname, 'html')))
  app.use(router.routes())
  app.use(router.allowedMethods())
  const port = parseInt(process.env.PORT, 10) || 10090
  app.listen(port)
  console.info('listen at 0.0.0.0:%s success!', port)
} catch (ex) {
  console.error('app global catch', ex)
}
