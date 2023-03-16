import CourseObj from "../entities/CourseObj";

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

// user API
const getUser = async (userID) => {
    return new Promise((resolve, reject) => {
        fetch(prefix + "/user?user_id=" + userID)
            .then((res)=> {
                if (res.status === 404) {
                    resolve([])
                }
                else if (res.status === 401) {
                    reject("Authentication Error")
                }
                else if (res.ok) {
                    res
                        .json()
                        .then((json)=> resolve(json))
                        .catch((err)=> reject("Generic Error"))
                }
            })
            .catch((err) => reject("Unavailable"))
    })
}

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

const getQuestions = async (courseId) => {
  return new Promise((resolve, reject) => {
    fetch(
      prefix + "/questions?course_id=" + courseId + "&page=1&itemsPerPage=-1"
    )
      .then((res) => {
        if (res.status === 404) {
          resolve([]);
        } else if (res.status === 401) {
          reject("Authentication Error");
        } else if (res.ok) {
          res
            .json()
            .then((json) => resolve(json))
            .catch((err) => reject(err));
        } else {
          reject("Generic Error");
        }
      })
      .catch((err) => reject("Unavailable"));
  });
};

const getDiscussions = async (questionId) => {
  return new Promise((resolve, reject) => {
    fetch(
      prefix +
        "/discussion?question_id=" +
        questionId +
        "&page=1&itemsPerPage=-1"
    )
      .then((res) => {
        if (res.status === 404) {
          resolve([]);
        } else if (res.status === 401) {
          reject("Authentication Error");
        } else if (res.ok) {
          res
            .json()
            .then((json) => resolve(json))
            .catch((err) => reject(err));
        } else {
          reject("Generic Error");
        }
      })
      .catch((err) => reject("Unavailable"));
  });
};

const searchCourses = async (query) => {
  return new Promise((resolve, reject) => {
    fetch(prefix + "/searchCourses?query=" + query)
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
            .catch((err) => reject("Generic Error"));
        } else {
          reject("Generic Error");
        }
      })
      .catch((err) => reject("Unavailable"));
  });
};

const searchQuestion = async () => {
  return new Promise((resolve, reject) => {
    fetch(prefix + "/searchQuestion")
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
            .catch((err) => reject("Generic Error"));
        } else {
          reject("Generic Error");
        }
      })
      .catch((err) => reject("Unavailable"));
  });
};

const searchDiscussion = async () => {
  return new Promise((resolve, reject) => {
    fetch(prefix + "/searchDiscussion")
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
            .catch((err) => reject("Generic Error"));
        } else {
          reject("Generic Error");
        }
      })
      .catch((err) => reject("Unavailable"));
  });
};

const getMyCourseNewQuestions = (userId) => {
  return new Promise((resolve, reject) => {
    fetch(
      prefix +
        "/myCoursesNewQuestions?user_id=" +
        userId +
        "&itemsPerPage=50&page=1"
    )
      ?.then((res) => {
        if (res.status === 404) {
          resolve([]);
        } else if (res.status === 401) {
          reject("Authentication Error");
        } else if (res.ok) {
          res
            ?.json()
            ?.then((json) => resolve(json))
            .catch((err) => reject(err));
        } else {
          reject("Generic Error");
        }
      })
      .catch((err) => reject("Unavailable"));
  });
};

const getMyBookmarkedQuestions = (userId) => {
  return new Promise((resolve, reject) => {
    fetch(
      prefix +
        "/myBookmarkedQuestions?user_id=" +
        userId +
        "&page=1&itemsPerPage=-1"
    )
      ?.then((res) => {
        if (res.status === 404) {
          resolve([]);
        } else if (res.status === 401) {
          reject("Authentication Error");
        } else if (res.ok) {
          res
            ?.json()
            ?.then((json) => resolve(json))
            .catch((err) => reject(err));
        } else {
          reject("Generic Error");
        }
      })
      .catch((err) => reject("Unavailable"));
  });
};

// simulation API
const getMySimulationResult = (userId) => {
    return new Promise((resolve, reject)=>{
        fetch( prefix + "/mySimulationResults?user_id=" + userId + "&page=1&itemsPerPage=-1")
            .then((res)=> {
                if (res.status === 404) {
                    resolve([]);
                } else if (res.status === 401) {
                    reject("Authentication Error");
                } else if (res.ok) {
                    res
                        ?.json()
                        ?.then((json) => resolve(json))
                        .catch((err) => reject(err));
                } else {
                    reject("Generic Error");
                }
            })
            .catch((err)=>{reject()})
    })
}

const API = {
    getUser,
  getCourses,
  getMyCourses,
  getQuestions,
  getDiscussions,
  searchCourses,
  searchQuestion,
  searchDiscussion,
  getMyCourseNewQuestions,
  getMyBookmarkedQuestions,
    getMySimulationResult
};
export default API;
