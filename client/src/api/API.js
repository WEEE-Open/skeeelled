import CommentObj from "../entities/CommentObj";
import CourseObj from "../entities/CourseObj";
import QuestionObj from "../entities/QuestionObj";
import ReplyObj from "../entities/ReplyObj";

const prefix = "http://localhost:8000/v1";

// header API
const postLogout = async () => {
  return new Promise((resolve, reject) => {
    fetch(prefix + "/logout", { method: "POST" })
      .then((res) => {
        if (res.ok) {
          resolve(null);
        } else {
          reject("Generic Error");
        }
      })
      .catch((err) => {
        reject("Server Error");
      });
  });
};

// Courses related APIs
const getMyCourses = async () => {
  return new Promise((resolve, reject) => {
    fetch(prefix + "/mycourses")
      .then((res) => {
        if (res.status === 404) {
          resolve([]);
        }
        res
          .json()
          .then((json) =>
            resolve(json.map((myCourses) => CourseObj.from(myCourses)))
          )
          .catch((err) => reject("Generic Error"));
      })
      .catch((err) => reject("Unavailable"));
  });
};

const getCourses = async () => {
  return new Promise((resolve, reject) => {
    fetch(prefix + "/courses")
      .then((res) => {
        if (res.status === 404) {
          resolve([]);
        } else if (res.status === 401) {
          reject("Authentication Error");
        } else if (res.ok) {
          res
            .json()
            .then((json) =>
              resolve(json.map((courses) => CourseObj.from(courses)))
            )
            .catch((err) => reject(err));
        } else {
          reject("Generic Error");
        }
      })
      .catch((err) => reject("Unavailable"));
  });
};

const getMyQuestions = async(user_id, page = 1, itemsPerPage = -1) => {
  return new Promise((resolve, reject) =>{
    fetch(prefix + "/myQuestions?user_id=" + user_id + "&page=" + page + "&itemsPerPage=" + itemsPerPage)
      .then((res) => {
        if (res.status === 404) {
          resolve([]);
        } else if (res.status === 401) {
          reject("Authentication Error");
        } else if (res.ok) {
          res
            .json()
            .then((json) =>
              resolve(json.map((myQuestions) => QuestionObj.from(myQuestions)))
            )
            .catch((err) => reject(err));
        } else {
          reject("Generic Error");
        }
      })
      .catch((err) => reject("Unavailable"));
  })
}

const getMyComments = async(user_id, page = 1, itemsPerPage = 1) => {
  return new Promise((resolve, reject) =>{
    fetch(prefix + "/myComments?user_id=" + user_id + "&page=" + page + "&itemsPerPage=" + itemsPerPage)
      .then((res) => {
        if(res.status === 404) {
          resolve([]);
        } else if (res.ok) {
          res
            .json()
            .then((json) =>
              resolve(json.map((comments) => CommentObj.from(comments)))
            )
            .catch((err) => reject(err))
        } else {
          reject("Generic Error");
        }
      })
      .catch((err) => reject("Unavailable"));
  })
}

const getMyReplies = async (user_id, page = 1, itemsPerPage = -1) => {
  return new Promise((resolve, reject) => {
    fetch(prefix + "/myReplies?user_id=" + user_id + "&page=" + page + "&itemsPerPage=" + itemsPerPage)
      .then((res) => {
        if (res.status === 404) {
          resolve([]);
        } else if (res.status === 401) {
          reject("Authentication Error");
        } else if (res.ok) {
          res
            .json()
            .then((json) =>
              resolve(json.map((myReplies) => ReplyObj.from(myReplies)))
            )
            .catch((err) => reject(err));
        } else {
          reject("Generic Error");
        }
      })
      .catch((err) => reject("Unavailable"));
  });
}

const getReplies = async (comment_id, page = 1, itemsPerPage = -1) => {
  return new Promise((resolve, reject) => {
    fetch(prefix + "/replies?comment_id=" + comment_id + "&page=" + page + "&itemsPerPage=" + itemsPerPage)
      .then((res) => {
        if (res.status === 404) {
          resolve([]);
        } else if (res.status === 401) {
          reject("Authentication Error");
        } else if (res.ok) {
          res
            .json()
            .then((json) =>
              resolve(json.replies.map((replies) => ReplyObj.from(replies)))
            )
            .catch((err) => reject(err));
        } else {
          reject("Generic Error");
        }
      })
      .catch((err) => reject("Unavailable"));
  });
}

const searchCourses = async (query) => {
  return new Promise((resolve, reject) => {
    fetch(prefix + "/searchCourses?query=" + query + "&limit=10")
      .then((res) => {
        if (res.status === 404) {
          resolve([]);
        } else if (res.status === 401) {
          reject("Authentication Error");
        } else if (res.status === 500) {
          resolve([]);
        } else if (res.ok) {
          res
            .json()
            .then((json) =>
              resolve(json.map((courses) => CourseObj.from(courses)))
            )
            .catch((err) => reject("Generic Error"));
        } else {
          reject("Generic Error");
        }
      })
      .catch((err) => reject("Unavailable"));
  });
};

const searchQuestion = async (query, course_id) => {
  return new Promise((resolve, reject) => {
    fetch(prefix + "/searchQuestion?query=" + query + "&course_id=" + course_id)
      .then((res) => {
        if (res.status === 404) {
          resolve([]);
        } else if (res.status === 401) {
          reject("Authentication Error");
        } else if (res.status === 500){
          resolve([]);
        } else if (res.ok) {
          res
            .json()
            .then((json) =>
              resolve(json.map((courses) => CourseObj.from(courses)))
            )
            .catch((err) => reject("Generic Error"));
        } else {
          reject("Generic Error");
        }
      })
      .catch((err) => reject("Unavailable"));
  });
};

const searchDiscussion = async (query, question_id) => {
  return new Promise((resolve, reject) => {
    fetch(prefix + "/searchDiscussion?query=" + query + "&question_id=" + question_id)
      .then((res) => {
        if (res.status === 404) {
          resolve([]);
        } else if (res.status === 401) {
          reject("Authentication Error");
        } else if (res.status === 500){
          resolve([]);
        } else if (res.ok) {
          res
            .json()
            .then((json) =>
              resolve(json.map((courses) => CourseObj.from(courses)))
            )
            .catch((err) => reject("Generic Error"));
        } else {
          reject("Generic Error");
        }
      })
      .catch((err) => reject("Unavailable"));
  });
};

const API = {
  getCourses,
  getMyCourses,
  getMyQuestions,
  getMyComments,
  getReplies,
  getMyReplies,
  searchCourses,
  searchQuestion,
  searchDiscussion,
};
export default API;
