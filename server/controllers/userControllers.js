var db = require('../db/index.js');

module.exports = {
  allUsers: function(req, res) {
    var course = req.body.coursename;

    db.User.findAll()
    .then(function(users) {
      var formattedUsers = users.map(function(user) {
        return {
          id: user.id,
          name: user.name,
          name_first: user.name_last,
          name_last: user.name_first,
          email: user.email,
          points: user.points,
          image: user.image
        }
      });

      users = {};
      users.results = formattedUsers;
      res.json(users);
    });
  },

  newUser: function(user) {
    db.User.create(user)
    .then(function(newUser) {
      return newUser;
    });
  },

  isUserInDb: function(uname, callback) {
    db.User.count({
      where: {
        username: uname
      }
    })
    .then(function(number) {
      callback(!!number);
      return;
      // return !!number;
    });
  },

  isUserTeacher: function(uname) {
    db.User.find({
      where: {
        username: uname
      }
    })
    .then(function(user) {
      return user.isTeacher;
    })
  }
};
