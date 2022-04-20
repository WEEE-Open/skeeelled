class CourseObj {
  constructor(id, code, name, cfu, prof, myCourse) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.cfu = cfu;
    this.prof = prof;
    myCourse ? (this.myCourse = 1) : (this.myCourse = 0);
  }

  static from(json) {
    return Object.assign(new CourseObj(), json);
  }
}

export default CourseObj;
