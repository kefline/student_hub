import User from './User.js';
import Profile from './Profile.js';
import Job from './Job.js';
import Forum from './Forum.js';
import ForumCategory from './ForumCategory.js';

// User - Profile associations
User.hasOne(Profile, {
  foreignKey: 'user_id',
  as: 'profile'
});
Profile.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'profileOwner'
});

// User - Job associations
User.hasMany(Job, {
  foreignKey: 'employer_id',
  as: 'postedJobs'
});
Job.belongsTo(User, {
  foreignKey: 'employer_id',
  as: 'employer'
});

// User - Forum associations
User.hasMany(Forum, {
  foreignKey: 'author_id',
  as: 'forumPosts'
});
Forum.belongsTo(User, {
  foreignKey: 'author_id',
  as: 'postAuthor'
});

// ForumCategory - Forum associations
ForumCategory.hasMany(Forum, {
  foreignKey: 'category_id',
  as: 'posts'
});
Forum.belongsTo(ForumCategory, {
  foreignKey: 'category_id',
  as: 'category'
});

export {
  User,
  Profile,
  Job,
  Forum,
  ForumCategory
}; 