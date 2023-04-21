import ReplyObj from "../entities/ReplyObj";

class DiscussionObj {
  constructor(
    id,
    author,
    upvoted_by,
    downvoted_by,
    has_verified_upvotes,
    timestamp,
    content,
    question_id,
    replies
  ) {
    this.id = id;
    this.author = author;
    this.upvoted_by = upvoted_by;
    this.downvoted_by = downvoted_by;
    has_verified_upvotes
      ? (this.has_verified_upvotes = 1)
      : (this.has_verified_upvotes = 0);
    this.timestamp = timestamp;
    this.content = content;
    this.question_id = question_id;
    this.replies = ReplyObj.from(replies);
  }

  static from(json) {
    return new DiscussionObj(
      json._id,
      json.author,
      json.upvoted_by,
      json.downvoted_by,
      json.has_verified_upvotes,
      json.timestamp,
      json.content,
      json.question_id,
      json.replies
    );
  }
}

export default DiscussionObj;
