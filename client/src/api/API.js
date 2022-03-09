import CoursesList from "../pages/CoursesList.js"
import Course from "../entities/Course";


const prefix = "/api"

// Courses related APIs
// const getMyCourses = async () => {
//     return new Promise((resolve, reject) => {
//         if (res.status === 404) {
//
//         }
//     })
// }

const getCourses = async () => {
    return new Promise((resolve, reject) => {
        fetch(prefix + "/courses")
            .then( res => {
                if (res.status === 404) {
                    reject("There is no such course in the database");
                }
                else if (res.status === 401) {
                    reject("Authentication Error");
                }
                else if (res.ok) {
                    res.json()
                        .then (json =>resolve(json.map(course => Course.from(course))))
                        .catch(err=> reject("Generic Error"));
                }
                else {
                    reject("Generic Error");
                }
            })
            .catch (err=> reject("Unavailable"));
    });
}

const API = {getCourses};
export default API;