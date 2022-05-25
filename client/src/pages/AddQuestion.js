import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { List, TextInput } from "../base";
import "./AddQuestion.css";

function AddQuestion(props) {
  const fakeCourses = ["Analysis 1", "Physics 1", "Geometry"];

  const [courses, setCourses] = useState(fakeCourses /*[]*/);
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

export default AddQuestion;
