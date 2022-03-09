
class Course {
    constructor(
        id,
        code,
        name,
        cfu,
        prof,
        ) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.cfu = cfu;
        this.prof = prof;
    }

    static from(json) {
        return Object.assign(new Course(), json);
    }

}

export default Course;