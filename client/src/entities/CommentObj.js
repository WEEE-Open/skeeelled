class CommentObj {
  constructor(
    id,
    author,
    upvoted_by,
    downvoted_by,
    has_verified_upvotes,
    timestamp,
    content,
    upovotes,
    downvotes,
    question_id
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
    this.upovotes = upovotes;
    this.downvotes = downvotes;
    this.question_id = question_id;

    //Properties for List
    let date = new Date(this.timestamp);
    this.createdat =
      date.getDay() +
      "/" +
      date.getMonth() +
      "/" +
      date.getFullYear() +
      " " +
      date.getHours() +
      ":" +
      date.getMinutes();

    //TODO Remove this, it's used to show something in the suggestion list
    this.question = this.content;
  }

  static from(json) {
    return new CommentObj(
      json._id,
      json.author,
      json.upvoted_by,
      json.downvoted_by,
      json.has_verified_upvotes,
      json.timestamp,
      json.content,
      json.upovotes,
      json.downvotes,
      json.question_id
    );
  }
}

export default CommentObj;
