class CourseObj {
  constructor(_id, name, years_active, professors, myCourse = false) {
    this._id = _id;
    this.name = name;
    this.years_active = years_active;
    this.professors = professors;
    myCourse ? (this.myCourse = 1) : (this.myCourse = 0);
  }

  static from(json) {
    return Object.assign(new CourseObj(), json);
  }
}

export default CourseObj;
