db.auth('root', 'example');
db = db.getSiblingDB('test');

db.createCollection('users');
db.createCollection('projects');
