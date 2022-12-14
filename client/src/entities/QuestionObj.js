class QuestionObj {
    constructor(id, owner, title, quiz, course, content, is_deleted, hint, tags, timestamp) {
        this.id = id;
        this.owner = owner;
        this.title = title;
        this.quiz = quiz;
        this.course = course;
        this.content = content;
        this.is_deleted = is_deleted;
        this.hint = hint;
        this.tags = tags;
        this.timestamp = timestamp;

        //Properties for List
        let date = new Date(this.timestamp);
        this.createdat = date.getDay() + "/" + date.getMonth() + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();
        this.question = this.content;
        this.excerpt = "#";
    }

    static from(json) {
        return new QuestionObj(
            json._id,
            json.owner,
            json.title,
            json.quiz,
            json.course,
            json.content,
            json.is_deleted,
            json.hint,
            json.tags,
            json.timestamp
        )
    }
}

export default QuestionObj;