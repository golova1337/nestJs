db = db.getSiblingDB('nest');

db.createCollection('users');
db.createCollection('projects');
db.createCollection('invitations');
