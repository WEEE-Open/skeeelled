import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { List, TextInput } from "../base";
import "./AddQuestion.css";
import { useEffect /* , useEffect */ } from "react";
import API from "../api/API";

function AddQuestion(props) {
  const [courses, setCourses] = useState([]);
	useEffect(() => {
		API.getMyCourses("s313131")
			.then(myCourses => setCourses(GenerateOptions(myCourses)))
			.catch(err => console.log(err));
	}, []);

  return (
    <>
      <Form.Label size="lg">Choose moodle XML file</Form.Label>
      <Form.Control type="file" size="lg" />
      <List scope="selection" title="Select course" rows={courses} />
      <Form.Check type="checkbox" label="This is an exam simulation" />
      {/* <TextInput/> */}
      <Button type="submit" className="submit-button my-4" onClick={() => {}}>
        Upload
      </Button>
    </>
  );
}

function GenerateOptions(results){
  var options = [];
  results.forEach(result => {
      options.push(result.name + " - " + result._id);
  });
  return options;
}

export default AddQuestion;
