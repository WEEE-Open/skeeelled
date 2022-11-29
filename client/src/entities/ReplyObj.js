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
    }

    static from(json) {
        return Object.assign(new ReplyObj, json);
    }
}

export default ReplyObj;