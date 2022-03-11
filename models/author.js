const { Schema, model } = require('mongoose');

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxlength: 100 },
  family_name: { type: String, required: true, maxlength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

// Virtual for author's full name
AuthorSchema.virtual('name').get(function () {
  // To avoid errors in case where an authro does not have either a family name or first name
  // return empty string
  let fullname = '';
  if (this.first_name && this.family_name) {
    fullname = this.family_name + ', ' + this.first_name;
  }
  if (!this.first_name || !this.family_name) {
    fullname = '';
  }
  return fullname;
});

// Virtual for author lifespan
AuthorSchema.virtual('lifespan').get(function () {
  let lifetime_string = '';
  if (this.date_of_birth) {
    lifetime_string = this.date_of_birth.getYear().toString();
  }
  lifetime_string += ' - ';
  if (this.date_of_death) {
    lifetime_string = this.date_of_death.getYear();
  }
  return lifetime_string;
});

// Virtual for author url
AuthorSchema.virtual('url').get(function () {
  return '/catalog/author' + this._id;
});

module.exports = model('Author', AuthorSchema);
