class ReplyObj {
    constructor(id, author, upvoted_by, downvoted_by, has_verified_upvotes, timestamp, content, upvotes, downvotes) {
        this.id = id;
        this.author = author;
        this.upvoted_by = upvoted_by;
        this.downvoted_by = downvoted_by;
        has_verified_upvotes ? (this.has_verified_upvotes = 1) : (this.has_verified_upvotes = 0);
        this.timestamp = timestamp;
        this.content = content;
        this.upvotes = upvotes;
        this.downvotes = downvotes;

        //Properties for List
        let date = new Date(this.timestamp);
        this.createdat = date.getDay() + "/" + date.getMonth() + "/" + date.getFullYear() + ", " + date.getHours() + ":" + date.getMinutes();
    }

    static from(json) {
        return new ReplyObj(
                json._id,
                json.author,
                json.upvoted_by,
                json.downvoted_by,
                json.has_verified_upvotes,
                json.timestamp,
                json.content,
                json.upvotes,
                json.downvotes
            );
    }
}

export default ReplyObj;