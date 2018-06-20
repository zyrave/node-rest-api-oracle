const employees = require('../controllers/employees');

module.exports = app => {
  app.get('/api/employees', employees.getAll);
  app.get('/api/employees/:id', employees.get);
  app.post('/api/employees', employees.add);
  app.put('/api/employees/:id', employees.edit);
  app.delete('/api/employees/:id', employees.remove);
};
