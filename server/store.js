// key: [object, object2]
// model: [record1, record2]
const _ = require('lodash')

let store = {

}

function unixtime() {
  return Math.floor(new Date().getTime()/1000)
}

function getAutoIncrementId(model) {
  const ID_TABLE = 'autoIncrementId'
  const idTable = store[ID_TABLE] || {};
  const id = idTable[model] || 1;
  idTable[model] = id + 1;
  store[ID_TABLE] = idTable;
  return id;
}

function add(model, record) {
  record.id = getAutoIncrementId(model);
  record.create_time = unixtime();
  const table = store[model] || []
  table.unshift(record);
  store[model] = table;
  // console.log('>>> store::', JSON.stringify(store))
  return {}
}

function update(model, record) {
  const table = store[model]
  if(table) {
    const index = _.findIndex(table, {id: record.id})
    if(index !== -1) {
      table[index] = record;
      return {effects: 1};
    }
  }
  return {effects: 0};
}

function deleteByID(model, id) {
  const table = store[model]
  if(table) {
    const effects = _.remove(table, {id})
    return {effects}
  }
  return {effects: 0}
}

function getByID(model, id) {
  const table = store[model]
  let data = null;
  if(table) {
    data = _.find(table, {id: record.id})
  }
  return data;
}


function paginate(array, limit, page) {
  page-=1 // because pages logically start with 1, but technically with 0
  return array.slice(page * limit, (page + 1) * limit);
}

function contains(value, key) {
  return value && value.indexOf(key) > -1
}


function list(model, query, page, limit) {

  const table = store[model]
  let values = [];
  if(table) {
    values = _.filter(table, function(obj) {
      if(!query.key) {
        return true;
      }
      return contains(obj.name, query.key) || contains(obj.description, query.key)
    })
  }
  const total = table.length;
  const datas = paginate(values, limit, page)
  return { datas, total}
}

function reset() {
  store = {}
}

exports.reset = reset;
exports.add = add;
exports.update = update;
exports.deleteByID = deleteByID;
exports.getByID = getByID;
exports.list = list;
