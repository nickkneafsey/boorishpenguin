var db = require('../db/index.js');
var UCtrl = require('./userControllers.js');

module.exports = {
  // This is for our home page
  allProducts: function(req, res) {
    // This is necessary because our Post schema 
    // contains both products and responses
    // var searchType = {
    //   home: {
    //     where: {
    //       isAResponse: false
    //     },
    //     include: [db.User]
    //   },
    //   trending: {
    //     where: {
    //       isAResponse: false
    //     },
    //     order: [["like_count","DESC"]],
    //     include: [db.User]
    //   },
    //   talkedAbout: {   
    //     where: {
    //       isAResponse: false
    //     },
    //     order: [["response_count","DESC"]],
    //     include: [db.User]
    //   }   
    // };

    db.Post.findAll({
      where: {
        isAResponse: false
      },
      include: [db.User]
    })
    //Format the array of questions into objects that our
    //front end will use
    .then(function(products) {
      var formattedProducts = products.map(function(product) {
        return {
          id: product.id,          
          title: product.title,
          text: product.text,
          isAResponse: false,
          like_count: product.like_count,
          response_count: product.response_count,
          responses: product.responses,
          createdAt: product.createdAt,
          user: product.User.username,
          userid: product.User.id,
          imgUrl: product.User.picture,
          updatedAt: product.updatedAt,
          provider_url: product.provider_url,
          thumbnail_url: product.thumbnail_url,
          provider_name: product.provider_name,
          thumbnail_width: product.thumbnail_width,
          thumbnail_height: product.thumbnail_height,
          url: product.url,
          type: product.type
        };
      });

      products = {};
      products.results = formattedProducts;
      res.json(products);
    });  
  },
  allTrending: function (req, res) {
    db.Post.findAll({
      where: {
        isAResponse: false
      },
      order: [["like_count","DESC"]],      
      //This creates the rows that are references instead of 
      //just the numbers
      include: [db.User]
    })
    .then(function(products) {
      var formattedProducts = products.map(function(product) {
        return {
          id: product.id,          
          title: product.title,
          text: product.text,
          isAResponse: false,
          like_count: product.like_count,
          response_count: product.response_count,
          responses: product.responses,
          createdAt: product.createdAt,
          user: product.User.username,
          userid: product.User.id,
          imgUrl: product.User.picture,
          updatedAt: product.updatedAt,
          provider_url: product.provider_url,
          thumbnail_url: product.thumbnail_url,
          provider_name: product.provider_name,
          thumbnail_width: product.thumbnail_width,
          thumbnail_height: product.thumbnail_height,
          url: product.url,
          type: product.type
        };
      });

      products = {};
      products.results = formattedProducts;
      res.json(products);
    });
  },

  allTalkedAbout: function (req, res) {
    db.Post.findAll({
      where: {
        isAResponse: false
      },
      order: [["response_count","DESC"]],      
      //This creates the rows that are references instead of 
      //just the numbers
      include: [db.User]
    })
    .then(function(products) {
      var formattedProducts = products.map(function(product) {
        return {
          id: product.id,          
          title: product.title,
          text: product.text,
          isAResponse: false,
          like_count: product.like_count,
          response_count: product.response_count,
          responses: product.responses,
          createdAt: product.createdAt,
          user: product.User.username,
          userid: product.User.id,
          imgUrl: product.User.picture,
          updatedAt: product.updatedAt,
          provider_url: product.provider_url,
          thumbnail_url: product.thumbnail_url,
          provider_name: product.provider_name,
          thumbnail_width: product.thumbnail_width,
          thumbnail_height: product.thumbnail_height,
          url: product.url,
          type: product.type
        };
      });

      products = {};
      products.results = formattedProducts;
      res.json(products);
    });
  },
  

  userInterests: function (req,res) {
    var orArr = [];
    db.Like.findAll({
      where: {
        UserId: req.params.userid
      }
    })
    .then(function (likes) {
      var formattedPosts = likes.map(function(like) {
        return {
          PostId: like.PostId
        };
      });
      for (var i = 0; i < formattedPosts.length; i ++) {
        orArr.push({id: formattedPosts[i].PostId});
      }
      db.Post.findAll({
        where: {
          $or: orArr
        }
      })
      .then(function(posts){
        res.json(posts);
      });
    });  
  },


  
  readPost: function(req, res) {
    var pid = req.params.id;

    db.Post.findById(pid, {
      include: [db.User]
    })
    .then(function(question) {
      console.log(question);
      var formattedProduct = [{
        id: question.id,
        title: question.title,
        text: question.text,
        isAResponse: false,
        points: question.points,
        url: question.url,
        provider_url: question.provider_url,
        thumbnail_width: question.thumbnail_width,
        thumbnail_height: question.thumbnail_height,
        provider_name: question.provider_name,
        thumbnail_url: question.thumbnail_url,
        like_count: question.like_count,

        //Number of responses
        responses: question.responses,
        createdAt: question.createdAt,
        user: question.User.username,
        userid: question.User.id,
        imgUrl: question.User.picture,
        updatedAt: question.updatedAt
      }];
      // This is what we do to find the responses
      db.Post.findAll({
        where: {
          postId: pid
        },
        include: [db.User]
      })
      .then(function(responses) {
        var formattedResponses = responses.map(function(response) {
          return {
            id: response.id,
            text: response.text,
            isAResponse: true,
            points: response.points,
            PostId: pid,
            user: response.User.name,
            userid: response.User.id,
            createdAt: response.createdAt,
            imgUrl: response.User.picture
          };
        });

        productAndResponses = {};
        productAndResponses.results = formattedProduct.concat(formattedResponses);
        res.json(productAndResponses);
      });
    });
  },


  newPost: function(req, res) {
    //Used for Post/Response
    var title = req.body.title;
    var text = req.body.text;
    var uid = req.body.id_user;
    //Prod Only
    var link = req.body.link || null;
    //Response Only
    //Check to see when we get these and how we get them
    var pid = req.body.id_question || null;
    var resp = (pid !== null) ? 1 : 0;
    //How are we given type?

    //Increment the Products Response Count if it's a Response
    if (pid) {
      // db.Post.upsert({response_count: response_count + 1},
      //   {
      //     where: {
      //       id: pid
      //     }
      //   });
      db.Post.findById(pid)
      .then(function (post) {
        post.update({
          response_count: post.response_count + 1
        });
      });
    }

    db.Post.create({
      title: title,
      text: text,
      url: link,
      UserId: uid,
      PostId: pid,
      isAResponse: resp,
      provider_url: req.body.provider_url || null,
      thumbnail_url: req.body.thumbnail_url || null,
      provider_name: req.body.provider_name || null,
      thumbnail_width: req.body.thumbnail_width || null,
      thumbnail_height: req.body.thumbnail_height || null,
      type: req.body.type || null
    })
    .then(function(post) {
      res.status(201).json(post);
    });
  },

  deletePost: function(req, res) {
    //How do we get this stuff without request?
    var pid = req.params.id;
    //Need this to authorize deletion
    var reqName = req.user.profile.emails[0].value;

    //This 

    // db.Post.findById(pid)
    // .then(function(post) {
    //   post.destroy()
    //   .then(function(id) {
    //     // if id
    //     res.sendStatus(204);
    //   });
    // });


    db.Post.findById(pid)
    .then(function(post) {
      return post.destroy();
    })
    .then(function(id) {
      if (id) {
        res.sendStatus(204);
      }
    });
  },
  likePost: function(req, res) {
    //Not done refactoring like yet


  }
};




















